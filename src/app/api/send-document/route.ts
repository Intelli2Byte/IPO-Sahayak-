import { NextRequest, NextResponse } from 'next/server';
import { GENERATED_DOCS } from '@/data/generatedDocuments';

interface SendDocumentResponse {
  success: boolean;
  message: string;
  documentFileName?: string;
  sentAt?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['Editor', 'CFO', 'Auditor', 'Company Secretary'];

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { recipientEmail, role, documentId } = body ?? {};

  if (!recipientEmail || !EMAIL_REGEX.test(recipientEmail)) {
    return NextResponse.json<SendDocumentResponse>(
      { success: false, message: 'Please enter a valid recipient email.' },
      { status: 400 }
    );
  }

  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json<SendDocumentResponse>(
      { success: false, message: 'Please select a valid role.' },
      { status: 400 }
    );
  }

  if (!documentId) {
    return NextResponse.json<SendDocumentResponse>(
      { success: false, message: 'Please select a document to send.' },
      { status: 400 }
    );
  }

  // Server-side re-verification: documentId must belong to the Generated
  // Documents source and be in a sendable ('Final') state.
  const document = GENERATED_DOCS.find((d) => d.id === documentId);

  if (!document) {
    return NextResponse.json<SendDocumentResponse>(
      { success: false, message: 'Selected document could not be found among generated documents.' },
      { status: 404 }
    );
  }

  if (document.status !== 'Final') {
    return NextResponse.json<SendDocumentResponse>(
      { success: false, message: 'Only finalized generated documents can be sent.' },
      { status: 403 }
    );
  }

  try {
    const backendResponse = await fetch(`${FASTAPI_BASE_URL}/api/access/invite-collaborator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collaborator_email: recipientEmail,
        role_authority: role,
        document_name: document.name,
      }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message: backendData?.detail || 'Unable to send document. Please try again.',
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json<SendDocumentResponse>({
      success: true,
      message: backendData?.message ?? 'Document sent successfully.',
      documentFileName: backendData?.documentFileName ?? document.name,
      sentAt: backendData?.sentAt ?? new Date().toISOString(),
    });
  } catch {
    return NextResponse.json<SendDocumentResponse>(
      { success: false, message: 'Unable to reach the document delivery service. Please try again.' },
      { status: 500 }
    );
  }
}
