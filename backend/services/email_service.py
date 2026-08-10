"""
Mail delivery engine: sends the two approved IPO prospectus documents
(DRHP and Abridged DRHP) to a collaborator via Brevo's SMTP relay.
"""

import os
import smtplib
from datetime import datetime, timezone
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

# --- Path resolution -------------------------------------------------------
# backend/services/email_service.py -> backend/ -> project root
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_PROJECT_ROOT = _BACKEND_DIR.parent

load_dotenv(_BACKEND_DIR / ".env")

BREVO_SMTP_HOST = "smtp-relay.brevo.com"
BREVO_SMTP_PORT = 587

# Strict allowlist: only these two documents may ever be attached and
# emailed. Keys must match the `name` field in
# src/data/generatedDocuments.ts (GENERATED_DOCS). Values are the exact
# on-disk filenames.
ALLOWED_DOCUMENTS: dict[str, str] = {
    "DRHP.pdf": "DRHP.pdf",
    "Abridged drhp.pdf": "Abridged drhp.pdf",
}

_SEARCH_DIRS = [
    _PROJECT_ROOT / "data" / "pdfs" / "prospectus",
    _PROJECT_ROOT / "public" / "uploads" / "documents",
]


def _resolve_document_path(document_name: str) -> Optional[Path]:
    """
    Safely resolves a document display name to an absolute file path.
    Restricted to a strict allowlist and a fixed set of known folders.
    Returns None if the document is not allowed or the file is missing.
    """
    real_filename = ALLOWED_DOCUMENTS.get(document_name)
    if real_filename is None:
        return None

    for directory in _SEARCH_DIRS:
        resolved_dir = directory.resolve()
        candidate = (resolved_dir / real_filename).resolve()

        # Guard against path traversal: candidate must still live inside
        # the intended directory.
        try:
            candidate.relative_to(resolved_dir)
        except ValueError:
            continue

        if candidate.is_file():
            return candidate

    return None


def broadcast_document_delivery(
    recipient_email: str, document_name: str, user_role: str
) -> bool:
    """
    Sends `document_name` as an email attachment to `recipient_email`
    via the Brevo SMTP relay. Returns True on success, False on any
    failure (missing credentials, missing file, SMTP error, etc).
    """
    smtp_user = os.getenv("BREVO_SMTP_USER")
    smtp_pass = os.getenv("BREVO_SMTP_PASS")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")

    if not smtp_user or not smtp_pass or not sender_email:
        print("[email_service] Missing Brevo SMTP credentials in environment.")
        return False

    file_path = _resolve_document_path(document_name)
    if file_path is None:
        print(f"[email_service] Document '{document_name}' is not an allowed/existing file.")
        return False

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = f"IPO Document Shared With You: {document_name}"

    body = (
        f"Hello,\n\n"
        f"You have been granted '{user_role}' access, and the document "
        f"'{document_name}' has been shared with you as part of the IPO "
        f"filing process.\n\n"
        f"Please find the document attached.\n\n"
        f"Regards,\n"
        f"Team & Access Management"
    )
    message.attach(MIMEText(body, "plain"))

    try:
        with open(file_path, "rb") as f:
            attachment = MIMEBase("application", "octet-stream")
            attachment.set_payload(f.read())
        encoders.encode_base64(attachment)
        attachment.add_header(
            "Content-Disposition",
            f'attachment; filename="{file_path.name}"',
        )
        message.attach(attachment)
    except OSError as exc:
        print(f"[email_service] Failed to read document '{document_name}': {exc}")
        return False

    server = None
    try:
        server = smtplib.SMTP(BREVO_SMTP_HOST, BREVO_SMTP_PORT, timeout=30)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(sender_email, [recipient_email], message.as_string())
        return True
    except Exception as exc:
        print(f"[email_service] Failed to send document to {recipient_email}: {exc}")
        return False
    finally:
        if server is not None:
            try:
                server.quit()
            except Exception:
                pass


def get_current_utc_iso() -> str:
    """Helper used by the API layer to timestamp successful sends."""
    return datetime.now(timezone.utc).isoformat()