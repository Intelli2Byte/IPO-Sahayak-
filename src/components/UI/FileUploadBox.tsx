'use client';

import { useRef, useState, useCallback } from 'react';
import { UploadCloud, CheckCircle2, X, Loader2 } from 'lucide-react';

export interface UploadedFileMeta {
  name: string;
  size: number;
  uploadedAt: string;
}

interface FileUploadBoxProps {
  expectedFileName?: string;
  helperText: string;
  file: UploadedFileMeta | null;
  isProcessing?: boolean;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
  accept?: string;
}

export default function FileUploadBox({
  expectedFileName,
  helperText,
  file,
  isProcessing,
  onFileSelected,
  onRemove,
  accept = '.pdf',
}: FileUploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFileSelected(files[0]);
    },
    [onFileSelected]
  );

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-300 bg-emerald-50/70 px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
            <p className="text-[9px] text-slate-500 font-semibold">
              {(file.size / 1024).toFixed(0)} KB · {isProcessing ? 'Analyzing document…' : 'Processed'}
            </p>
          </div>
        </div>
        {isProcessing ? (
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
        ) : (
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-amber-50/60' : 'border-slate-300 bg-[#fffdf8] hover:border-primary/60'
      }`}
    >
      <UploadCloud className={`w-5 h-5 ${isDragActive ? 'text-primary' : 'text-slate-400'}`} />
      <span className="text-[11px] font-bold text-slate-700">
        {expectedFileName ? <>Drop &apos;{expectedFileName}&apos; here, or click to browse</> : 'Drop PDF here, or click to browse'}
      </span>
      <span className="text-[9px] text-slate-500 font-semibold max-w-xs">{helperText}</span>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </label>
  );
}
