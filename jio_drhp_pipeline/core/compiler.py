from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PyPDF2 import PdfMerger
import config

ALIGN_MAP = {"left": 0, "center": 1, "right": 2, "justify": 4}

def render_section_pdf(mapped_json: dict, output_path: str):
    geom = mapped_json.get("page_geometry", {})
    margins = geom.get("margins", {})
    top_m, bottom_m = margins.get("top_pt", 72), margins.get("bottom_pt", 72)
    left_m, right_m = margins.get("left_pt", 72), margins.get("right_pt", 72)

    doc = SimpleDocTemplate(output_path, pagesize=A4, rightMargin=right_m,
                             leftMargin=left_m, topMargin=top_m, bottomMargin=bottom_m)
    elements, styles = [], getSampleStyleSheet()
    available_width = A4[0] - left_m - right_m

    for i, section in enumerate(mapped_json.get("sections", [])):
        sec_type = section.get("type", "body_text")
        rules = section.get("styling_rules", {})
        text = section.get("text", "")

        if sec_type in ["document_title", "heading1", "heading2", "body_text", "footnotes"]:
            if not text:
                continue
            if rules.get("text_transform") == "uppercase":
                text = text.upper()
            if rules.get("font_weight") == "bold":
                text = f"<b>{text}</b>"
            style = ParagraphStyle(
                name=f"S{i}", parent=styles["Normal"],
                fontSize=rules.get("font_size_pt", 10), leading=rules.get("leading_pt", 12),
                alignment=ALIGN_MAP.get(str(rules.get("alignment", "left")).lower(), 0),
                spaceBefore=rules.get("space_before_pt", 0), spaceAfter=rules.get("space_after_pt", 6),
            )
            elements.append(Paragraph(text, style))

        elif sec_type == "table":
            data = section.get("data", [])
            if not data:
                continue
            header_style = ParagraphStyle(name=f"H{i}", parent=styles["Normal"],
                                           fontSize=rules.get("font_size_pt", 9), fontName="Helvetica-Bold",
                                           textColor=colors.white, alignment=1)
            cell_style = ParagraphStyle(name=f"C{i}", parent=styles["Normal"],
                                         fontSize=rules.get("font_size_pt", 8), alignment=0)
            formatted = []
            for r_idx, row in enumerate(data):
                formatted.append([Paragraph(str(c).replace("\n", "<br/>"),
                                             header_style if r_idx == 0 else cell_style) for c in row])
            num_cols = len(data[0])
            t = Table(formatted, colWidths=[available_width / num_cols] * num_cols)
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1A3668")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                ("BOX", (0, 0), (-1, -1), 1.0, colors.black),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 12))

    doc.build(elements)

def merge_final(section_pdf_paths: list[str], output_path: str):
    merger = PdfMerger()
    for p in section_pdf_paths:
        merger.append(p)
    merger.write(output_path)
    merger.close()
