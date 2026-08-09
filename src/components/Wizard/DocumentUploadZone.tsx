'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface DocumentUploadZoneProps {
  documentType: string;
  title: string;
  description: string;
  onUploadComplete: (data: any) => void;
  extractedData?: any;
  isProcessing?: boolean;
  error?: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function DocumentUploadZone({
  documentType,
  title,
  description,
  onUploadComplete,
  extractedData,
}: DocumentUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        setLocalError('Only PDF files are accepted.');
        return;
      }
      setIsUploading(true);
      setLocalError(null);
      setFileName(file.name);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      try {
        const res = await fetch(`${API_BASE}/api/documents/parse`, { method: 'POST', body: formData });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          const detail = payload?.detail ?? `Upload failed with status ${res.status}`;
          throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
        }
        onUploadComplete(payload.extractedData);
      } catch (err: any) {
        setLocalError(err?.message || 'Something went wrong while parsing this document.');
      } finally {
        setIsUploading(false);
      }
    },
    [documentType, onUploadComplete]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const hasData = !!extractedData;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
        isDragging ? 'border-purple-400 bg-purple-50'
        : hasData ? 'border-emerald-300 bg-emerald-50'
        : localError ? 'border-red-300 bg-red-50'
        : 'border-slate-300 bg-slate-50 hover:bg-slate-100 border-dashed'
      }`}
    >
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileSelect} />

      <div className={`flex items-center justify-center w-9 h-9 rounded-md shrink-0 ${
        isUploading ? 'bg-purple-100' : hasData ? 'bg-emerald-100' : localError ? 'bg-red-100' : 'bg-white border border-slate-200'
      }`}>
        {isUploading ? <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
        : hasData ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        : localError ? <XCircle className="w-4 h-4 text-red-600" />
        : <UploadCloud className="w-4 h-4 text-slate-500" />}
      </div>

      <div className="flex-1 min-w-0">
        {isUploading ? (
          <p className="text-xs font-semibold text-slate-700 truncate">Parsing {fileName}…</p>
        ) : hasData ? (
          <>
            <p className="text-xs font-bold text-emerald-800 truncate">{fileName || 'Document'} parsed successfully</p>
            <p
              className="text-[10px] text-emerald-700 underline"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Upload a different file
            </p>
          </>
        ) : localError ? (
          <>
            <p className="text-xs font-bold text-red-700 truncate">{localError}</p>
            <p className="text-[10px] text-red-600 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Click to try again</p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold text-slate-700">{title}</p>
            <p className="text-[10px] text-slate-500 truncate">{description}</p>
          </>
        )}
      </div>

      {!isUploading && !hasData && !localError && (
        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
          <FileText className="w-3 h-3" /> PDF · 25MB
        </span>
      )}
    </div>
  );
}