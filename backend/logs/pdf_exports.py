from io import BytesIO
from datetime import datetime
from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph

def generate_pdf_report(queryset, title, columns):
    """
    Generate a PDF report for the given queryset.
    
    :param queryset: The queryset containing the data to be exported
    :param title: The title of the report
    :param columns: A list of tuples, each containing (column_name, data_key)
    :return: HttpResponse with the generated PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))
    elements = []
    styles = getSampleStyleSheet()
    
    elements.append(Paragraph(title, styles['Title']))
    
    now = timezone.now()
    formatted_date = now.strftime('%Y%m%d%H%M')

    elements.append(Paragraph(f"Generated at: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    
    data = [[column[0] for column in columns]]
    for item in queryset:
        row = []
        for _, data_key in columns:
            value = getattr(item, data_key)
            if isinstance(value, str) and len(value) > 100:
                value = value[:100] + '...'
            elif hasattr(value, 'strftime'):
                value = value.strftime('%Y-%m-%d %H:%M:%S')
            row.append(value)
        data.append(row)

    table = Table(data)
    
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 12),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])
    table.setStyle(style)
    
    elements.append(table)

    doc.build(elements)
    
    pdf = buffer.getvalue()
    buffer.close()
    
    # Create the HTTP response with PDF mime type
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{title.lower().replace(" ", "_")}-{formatted_date}_report.pdf"'
    response.write(pdf)
    
    return response