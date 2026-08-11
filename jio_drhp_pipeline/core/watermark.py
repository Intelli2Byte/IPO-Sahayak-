from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PyPDF2 import PdfReader, PdfWriter
import config

def _build_watermark_pdf(page_width, page_height) -> BytesIO:
    cfg = config.WATERMARK_DEFAULTS
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(page_width, page_height))
    c.saveState()
    c.translate(page_width / 2, page_height / 2)
    c.rotate(cfg["rotation_deg"])
    c.setFillAlpha(cfg["opacity"])

    logo = ImageReader(str(config.SEBI_LOGO_PATH))
    img_w, img_h = logo.getSize()
    target_w = page_width * cfg["scale_pct"]
    target_h = target_w * (img_h / img_w)

    c.drawImage(logo, -target_w / 2, -target_h / 2, width=target_w, height=target_h, mask="auto")
    c.restoreState()
    c.save()
    buf.seek(0)
    return buf

def apply_watermark(input_pdf_path: str, output_pdf_path: str):
    if not config.SEBI_LOGO_PATH.exists():
        print(f"⚠️  SEBI logo not found at {config.SEBI_LOGO_PATH} — skipping watermark.")
        import shutil
        shutil.copy(input_pdf_path, output_pdf_path)
        return

    reader = PdfReader(input_pdf_path)
    writer = PdfWriter()

    for page in reader.pages:
        pw, ph = float(page.mediabox.width), float(page.mediabox.height)
        wm_buf = _build_watermark_pdf(pw, ph)
        wm_page = PdfReader(wm_buf).pages[0]
        page.merge_page(wm_page)
        writer.add_page(page)

    with open(output_pdf_path, "wb") as f:
        writer.write(f)