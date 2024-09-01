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
    elements.append(Paragraph(f"Incident Report: {incident_report.id}", styles['Title']))
    elements.append(Spacer(1, 12))
    
    # Add details
    elements.append(Paragraph(f"Type: {incident_report.get_type_display()}", styles['Normal']))
    elements.append(Paragraph(f"Status: {incident_report.get_status_display()}", styles['Normal']))
    elements.append(Paragraph(f"Source: {incident_report.source}", styles['Normal']))
    elements.append(Paragraph(f"User: {incident_report.user.username}", styles['Normal']))
    elements.append(Spacer(1, 12))
    
    # Add description
    elements.append(Paragraph("Description:", styles['Heading2']))
    elements.append(Paragraph(incident_report.description, styles['Normal']))
    elements.append(Spacer(1, 12))
    
    # Add rules
    elements.append(Paragraph("Rules:", styles['Heading2']))
    for rule in incident_report.rules.all():
        elements.append(Paragraph(f"- {rule.name} ({rule.severity}): {rule.description}", styles['Normal']))
    
    if incident_report.custom_rules:
        elements.append(Paragraph("Custom Rules:", styles['Heading3']))
        elements.append(Paragraph(incident_report.custom_rules, styles['Normal']))
    
    doc.build(elements)
    
    pdf = buffer.getvalue()
    buffer.close()
    
    return ContentFile(pdf, name=f'incident_report_{incident_report.id}.pdf')