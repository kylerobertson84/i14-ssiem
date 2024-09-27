from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from django.core.files.base import ContentFile

def generate_pdf(incident_report):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Add title
    elements.append(Paragraph(f"Incident Report ID: {incident_report.id}", styles['Title']))
    elements.append(Paragraph(f"(Mock Report in PDF)", styles['Normal']))
    elements.append(Spacer(1, 12))

    # Add details
    elements.append(Paragraph("Meta data:", styles['Heading2']))
    elements.append(Paragraph(f"Type: {incident_report.get_type_display()}", styles['Normal']))
    elements.append(Paragraph(f"Status: {incident_report.get_status_display()}", styles['Normal']))
    elements.append(Paragraph(f"Created At: {incident_report.created_at}", styles['Normal']))
    elements.append(Paragraph(f"Last Updated At: {incident_report.updated_at}", style=['Normal']))
    elements.append(Paragraph(f"User ID: {incident_report.user.user_id}", styles['Normal']))
    elements.append(Paragraph(f"User Email: {incident_report.user.email}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # Add description
    elements.append(Paragraph("Description:", styles['Heading2']))
    elements.append(Paragraph(incident_report.description, styles['Normal']))
    elements.append(Spacer(1, 12))

    # Add rules
    elements.append(Paragraph("Rules:", styles['Heading2']))
    if incident_report.rules.exists():
        for rule in incident_report.rules.all():
            elements.append(Paragraph(f"- {rule.name} ({rule.severity}): {rule.description}", styles['Normal']))
    else:
        elements.append(Paragraph("No rules associated with this report.", styles['Normal']))

    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    return ContentFile(pdf, name=f'incident_report_{incident_report.id}.pdf')