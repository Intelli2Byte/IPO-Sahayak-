from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

# Pehle se bane services block ke paas ise jodna hai
from services.email_service import (
    ALLOWED_DOCUMENTS,
    broadcast_document_delivery,
    get_current_utc_iso,
)

# Router initialization (Agar aapki file mein pehle se router upar bana hai, toh ise use na karein)
router = APIRouter()

# Strict allowlist roles matching your front-end schema
VALID_ROLES = {"Editor", "CFO", "Auditor", "Company Secretary"}

# Request payload structured data validation
class DocumentInvitationRequest(BaseModel):
    collaborator_email: EmailStr
    role_authority: str
    document_name: str


# --- Aapke purane existing routes yahan (jaise /health, /documents etc.) bane rahenge ---
# KUCH BHI OVERWRITE NAHI KARNA HAI.


# FILE KE SABSE NICHE YEH ENDPOINT APPEND KARNA HAI:
@router.post("/access/invite-collaborator")
async def invite_collaborator(payload: DocumentInvitationRequest):
    """
    Validates the invitation payload against the allowed roles and the
    strict document allowlist, then dispatches the document via the
    Brevo mail engine.
    """
    # 1. Role Authority ki checking
    if payload.role_authority not in VALID_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role_authority. Must be one of: {', '.join(sorted(VALID_ROLES))}",
        )

    # 2. Strict Document Allowlist ki checking 
    if payload.document_name not in ALLOWED_DOCUMENTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid document_name. Must be one of: {', '.join(ALLOWED_DOCUMENTS.keys())}",
        )

    # 3. Brevo mail engine trigger logic
    try:
        delivered = broadcast_document_delivery(
            recipient_email=payload.collaborator_email,
            document_name=payload.document_name,
            user_role=payload.role_authority,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document transmission failed due to an internal error: {exc}",
        )

    # 4. Delivery confirmation handling
    if not delivered:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Document transmission failed. The mail engine could not deliver the document.",
        )

    # 5. Success state payload to align back to frontend log table
    return {
        "success": True,
        "message": "Document sent successfully.",
        "documentFileName": payload.document_name,
        "sentAt": get_current_utc_iso(),
    }
