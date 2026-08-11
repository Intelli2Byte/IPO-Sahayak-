'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import {
  DocumentFile,
  GENERATED_DOCS,
} from '@/data/generatedDocuments';

interface GeneratedDocumentsContextValue {
  documents: DocumentFile[];

  addDocument: (
    doc: Omit<DocumentFile, 'id'>
  ) => void;

  deleteDocument: (
    id: string
  ) => void;
}

const GeneratedDocumentsContext =
  createContext<GeneratedDocumentsContextValue | undefined>(
    undefined
  );

export function GeneratedDocumentsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [documents, setDocuments] =
    useState<DocumentFile[]>(GENERATED_DOCS);

  // ==========================================================
  // ADD DOCUMENT
  // ==========================================================

  const addDocument = useCallback(
    (doc: Omit<DocumentFile, 'id'>) => {
      const newDocument: DocumentFile = {
        ...doc,
        id: `doc-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      };

      setDocuments((previousDocuments) => [
        newDocument,
        ...previousDocuments,
      ]);
    },
    []
  );

  // ==========================================================
  // DELETE DOCUMENT
  // ==========================================================

  const deleteDocument = useCallback((id: string) => {
    setDocuments((previousDocuments) =>
      previousDocuments.filter(
        (document) => document.id !== id
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      documents,
      addDocument,
      deleteDocument,
    }),
    [documents, addDocument, deleteDocument]
  );

  return (
    <GeneratedDocumentsContext.Provider value={value}>
      {children}
    </GeneratedDocumentsContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useGeneratedDocuments() {
  const context = useContext(
    GeneratedDocumentsContext
  );

  if (!context) {
    throw new Error(
      'useGeneratedDocuments must be used within a GeneratedDocumentsProvider'
    );
  }

  return context;
}