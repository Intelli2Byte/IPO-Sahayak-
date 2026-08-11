import { NextRequest, NextResponse } from 'next/server';
import { GENERATED_DOCS } from '@/data/generatedDocuments';

interface SendDocumentResponse {
  success: boolean;
  message: string;
  documentFileName?: string;
  documentUrl?: string;
  sentAt?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_ROLES = [
  'Editor',
  'CFO',
  'Auditor',
  'Company Secretary',
];

const FASTAPI_BASE_URL =
  process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    // ============================================================
    // 1. READ REQUEST
    // ============================================================

    const body = await request.json();

    const {
      recipientEmail,
      role,
      documentId,
    } = body ?? {};

    // ============================================================
    // 2. VALIDATE EMAIL
    // ============================================================

    if (
      !recipientEmail ||
      typeof recipientEmail !== 'string' ||
      !EMAIL_REGEX.test(recipientEmail.trim())
    ) {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message: 'Please enter a valid recipient email.',
        },
        { status: 400 }
      );
    }

    // ============================================================
    // 3. VALIDATE ROLE
    // ============================================================

    if (
      !role ||
      typeof role !== 'string' ||
      !VALID_ROLES.includes(role)
    ) {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message: 'Please select a valid role.',
        },
        { status: 400 }
      );
    }

    // ============================================================
    // 4. VALIDATE DOCUMENT ID
    // ============================================================

    if (!documentId || typeof documentId !== 'string') {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message: 'Please select a document to send.',
        },
        { status: 400 }
      );
    }

    // ============================================================
    // 5. FIND DOCUMENT
    // ============================================================

    const document = GENERATED_DOCS.find(
      (doc) => doc.id === documentId
    );

    if (!document) {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message:
            'Selected document could not be found among generated documents.',
        },
        { status: 404 }
      );
    }

    // ============================================================
    // 6. ONLY FINAL DOCUMENTS CAN BE SENT
    // ============================================================

    if (document.status !== 'Final') {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message:
            'Only finalized generated documents can be sent.',
        },
        { status: 403 }
      );
    }

    // ============================================================
    // 7. VERIFY DOCUMENT URL
    // ============================================================

    if (!document.url) {
      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message: 'Selected document does not have a valid file URL.',
        },
        { status: 404 }
      );
    }

    // ============================================================
    // 8. IMPORTANT
    //
    // The actual generated PDF is:
    //
    // public/generated-documents/
    // Generated-BY-ipo-Sahayak-Document.pdf
    //
    // The browser URL is:
    //
    // /generated-documents/
    // Generated-BY-ipo-Sahayak-Document.pdf
    //
    // ============================================================

    const documentFileName = document.fileName;

    const documentUrl = document.url;

    console.log('========================================');
    console.log('DOCUMENT SEND REQUEST');
    console.log('Recipient:', recipientEmail);
    console.log('Role:', role);
    console.log('Document ID:', document.id);
    console.log('Display Name:', document.name);
    console.log('Actual File:', documentFileName);
    console.log('Document URL:', documentUrl);
    console.log('========================================');

    // ============================================================
    // 9. SEND TO FASTAPI
    // ============================================================

    const backendResponse = await fetch(
      `${FASTAPI_BASE_URL}/api/access/invite-collaborator`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          collaborator_email: recipientEmail.trim(),

          role_authority: role,

          // Display name
          document_name: document.name,

          // ACTUAL FILE NAME
          document_file_name: documentFileName,

          // PUBLIC URL
          document_url: documentUrl,
        }),
      }
    );

    // ============================================================
    // 10. READ FASTAPI RESPONSE SAFELY
    // ============================================================

    let backendData: any = {};

    try {
      backendData = await backendResponse.json();
    } catch {
      backendData = {};
    }

    // ============================================================
    // 11. FASTAPI ERROR
    // ============================================================

    if (!backendResponse.ok) {
      console.error(
        'FastAPI document delivery error:',
        backendResponse.status,
        backendData
      );

      return NextResponse.json<SendDocumentResponse>(
        {
          success: false,
          message:
            backendData?.detail ||
            backendData?.message ||
            `Document delivery service returned ${backendResponse.status}.`,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    // ============================================================
    // 12. SUCCESS
    // ============================================================

    return NextResponse.json<SendDocumentResponse>({
      success: true,

      message:
        backendData?.message ??
        'Document sent successfully.',

      documentFileName:
        backendData?.documentFileName ??
        documentFileName,

      documentUrl:
        backendData?.documentUrl ??
        documentUrl,

      sentAt:
        backendData?.sentAt ??
        new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      'POST /api/send-document failed:',
      error
    );

    return NextResponse.json<SendDocumentResponse>(
      {
        success: false,
        message:
          'Unable to reach the document delivery service. Please try again.',
      },
      { status: 500 }
    );
  }
}