export type GeneratedDocType = 'pdf' | 'docx';
export type GeneratedDocStatus = 'Final' | 'Draft';

export interface DocumentFile {
  id: string;
  name: string;
  type: GeneratedDocType;
  version: string;
  dateGenerated: string;
  status: GeneratedDocStatus;
}

// SINGLE SOURCE OF TRUTH for all generated documents (DRHP, Abridged DRHP, etc).
// Consumed by both components/GeneratedDocuments/GeneratedDocuments.tsx and
// components/Dashboard/TeamAccess.tsx (via GeneratedDocumentsContext).
// Do NOT duplicate this array anywhere else.
export const GENERATED_DOCS: DocumentFile[] = [
  { id: 'doc-1', name: 'DRHP.pdf', type: 'pdf', version: 'v2.1', dateGenerated: 'aug 8th, 2026', status: 'Final' },
  { id: 'doc-2', name: 'Abridged drhp.pdf', type: 'pdf', version: 'v1.4', dateGenerated: 'Aug 8th, 2026', status: 'Final' },
  { id: 'doc-3', name: 'DRHP.docx', type: 'docx', version: 'v2.1', dateGenerated: 'aug 8th, 2026', status: 'Draft' },
  { id: 'doc-4', name: 'Abridged drhp.docx', type: 'docx', version: 'v1.4', dateGenerated: 'Aug 8th, 2026', status: 'Draft' },
];

// Only 'Final' generated documents are eligible to be sent to a collaborator.
// Drafts, processing, or failed generations must never appear in Send Document.
export function getSendableGeneratedDocuments(docs: DocumentFile[]): DocumentFile[] {
  return docs.filter((doc) => doc.status === 'Final');
}