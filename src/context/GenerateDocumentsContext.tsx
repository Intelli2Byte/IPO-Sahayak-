'use client';

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { DocumentFile, GENERATED_DOCS } from '@/data/generatedDocuments';

interface GeneratedDocumentsContextValue {
  documents: DocumentFile[];
  deleteDocument: (id: string) => void;
  addDocument: (doc: DocumentFile) => void;
}

const GeneratedDocumentsContext = createContext<GeneratedDocumentsContextValue | null>(null);

export function GeneratedDocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentFile[]>(GENERATED_DOCS);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((docs) => docs.filter((d) => d.id !== id));
  }, []);

  const addDocument = useCallback((doc: DocumentFile) => {
    setDocuments((docs) => [...docs, doc]);
  }, []);

  const value = useMemo(
    () => ({ documents, deleteDocument, addDocument }),
    [documents, deleteDocument, addDocument]
  );

  return (
    <GeneratedDocumentsContext.Provider value={value}>
      {children}
    </GeneratedDocumentsContext.Provider>
  );
}

export function useGeneratedDocuments() {
  const ctx = useContext(GeneratedDocumentsContext);
  if (!ctx) {
    throw new Error('useGeneratedDocuments must be used within a GeneratedDocumentsProvider');
  }
  return ctx;
}