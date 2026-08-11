// export type GeneratedDocType = 'pdf' | 'docx';
// export type GeneratedDocStatus = 'Final' | 'Draft';

// export interface DocumentFile {
//   id: string;
//   name: string;
//   type: GeneratedDocType;
//   version: string;
//   dateGenerated: string;
//   status: GeneratedDocStatus;

//   /**
//    * Public URL to the generated document.
//    *
//    * Files stored inside /public are accessed from the root URL.
//    *
//    * Example:
//    * public/generated-documents/example.pdf
//    * becomes:
//    * /generated-documents/example.pdf
//    */
//   url?: string;
// }

// // ============================================================
// // SINGLE SOURCE OF TRUTH
// // ============================================================

// export const GENERATED_DOCS: DocumentFile[] = [
//   {
//     id: 'doc-1',
//     name: 'DRHP.pdf',
//     type: 'pdf',
//     version: 'v2.1',
//     dateGenerated: 'Aug 8th, 2026',
//     status: 'Final',
//     url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.pdf',
//   },

//   {
//     id: 'doc-2',
//     name: 'Abridged DRHP.pdf',
//     type: 'pdf',
//     version: 'v1.4',
//     dateGenerated: 'Aug 8th, 2026',
//     status: 'Final',
//     url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.pdf',
//   },

//   {
//     id: 'doc-3',
//     name: 'DRHP.docx',
//     type: 'docx',
//     version: 'v2.1',
//     dateGenerated: 'Aug 8th, 2026',
//     status: 'Draft',
//     url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.docx',
//   },

//   {
//     id: 'doc-4',
//     name: 'Abridged DRHP.docx',
//     type: 'docx',
//     version: 'v1.4',
//     dateGenerated: 'Aug 8th, 2026',
//     status: 'Draft',
//     url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.docx',
//   },
// ];

// // ============================================================
// // SENDABLE DOCUMENTS
// // Only FINAL documents can be sent to collaborators.
// // ============================================================

// export function getSendableGeneratedDocuments(
//   docs: DocumentFile[]
// ): DocumentFile[] {
//   return docs.filter((doc) => doc.status === 'Final');
// }

export type GeneratedDocType = 'pdf' | 'docx';
export type GeneratedDocStatus = 'Final' | 'Draft';

export interface DocumentFile {
  id: string;
  name: string;
  type: GeneratedDocType;
  version: string;
  dateGenerated: string;
  status: GeneratedDocStatus;

  /**
   * Public URL of the actual generated file.
   *
   * Physical file:
   * public/generated-documents/Generated-BY-ipo-Sahayak-Document.pdf
   *
   * Browser URL:
   * /generated-documents/Generated-BY-ipo-Sahayak-Document.pdf
   */
  url: string;

  /**
   * Actual filename on disk.
   * This is different from the display name.
   */
  fileName: string;
}

// ============================================================
// SINGLE SOURCE OF TRUTH
// ============================================================

export const GENERATED_DOCS: DocumentFile[] = [
  {
    id: 'doc-1',
    name: 'DRHP.pdf',
    type: 'pdf',
    version: 'v2.1',
    dateGenerated: 'Aug 8th, 2026',
    status: 'Final',

    // Actual generated PDF
    url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.pdf',

    // Actual filename
    fileName: 'Generated-BY-ipo-Sahayak-Document.pdf',
  },

  {
    id: 'doc-2',
    name: 'Abridged DRHP.pdf',
    type: 'pdf',
    version: 'v1.4',
    dateGenerated: 'Aug 8th, 2026',
    status: 'Final',

    // Currently using the same generated PDF
    url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.pdf',

    // Actual filename
    fileName: 'Generated-BY-ipo-Sahayak-Document.pdf',
  },

  {
    id: 'doc-3',
    name: 'DRHP.docx',
    type: 'docx',
    version: 'v2.1',
    dateGenerated: 'Aug 8th, 2026',
    status: 'Draft',

    url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.docx',

    fileName: 'Generated-BY-ipo-Sahayak-Document.docx',
  },

  {
    id: 'doc-4',
    name: 'Abridged DRHP.docx',
    type: 'docx',
    version: 'v1.4',
    dateGenerated: 'Aug 8th, 2026',
    status: 'Draft',

    url: '/generated-documents/Generated-BY-ipo-Sahayak-Document.docx',

    fileName: 'Generated-BY-ipo-Sahayak-Document.docx',
  },
];

// ============================================================
// SENDABLE DOCUMENTS
// Only FINAL documents can be sent.
// ============================================================

export function getSendableGeneratedDocuments(
  docs: DocumentFile[]
): DocumentFile[] {
  return docs.filter((doc) => doc.status === 'Final');
}