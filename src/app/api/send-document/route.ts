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

  // Server-side re-verification: the documentId must belong to the
  // Generated Documents source (never the repository/vault documents),
  // and must be in a sendable ('Final') state. Never trust the frontend.
  //
  // NOTE (prototype limitation): GENERATED_DOCS here is the static base
  // list, since this app has no backend persistence layer for generated
  // documents yet. Documents added/removed at runtime only live in the
  // client-side GeneratedDocumentsContext. Once generated documents are
  // persisted server-side, swap this import for a real data-access call.
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

  // NOTE: sender's SEND_DOCUMENT permission is enforced client-side against
  // the mock current-user/team record for this prototype (see
  // getCurrentUserWithPermissions() in data/mockData.ts). Re-verify against
  // the authenticated session user once real auth/session is wired in.

  // Simulated send latency — plug in your document-delivery provider here.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return NextResponse.json<SendDocumentResponse>({
    success: true,
    message: 'Document sent successfully.',
    documentFileName: document.name,
    sentAt: new Date().toISOString(),
  });
}
