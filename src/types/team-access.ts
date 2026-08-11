export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  id: string;
  type: ToastType;
  message: string;
}

export interface SendDocumentPayload {
  recipientEmail: string;
  role: string;
  documentId: string;
}

export interface SendDocumentResponse {
  success: boolean;
  message: string;
  documentFileName?: string;
  sentAt?: string;
}

export interface SentDocumentLog {
  id: string;
  date: string;      // formatted display date, e.g. "09 Aug 2026"
  name: string;       // sender's display name (from current user profile)
  email: string;      // recipient email
  document: string;   // actual generated filename, e.g. "DRHP.pdf"
}