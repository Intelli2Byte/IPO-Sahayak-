'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

interface EvidenceUploadProps {
  label?: string;
  onUpload: (fileName: string) => void;
  status?: 'pending' | 'verified' | 'extracted' | 'missing';
  currentFile?: string;
}

export default function EvidenceUpload({ label = 'Supporting Evidence', onUpload, status = 'pending', currentFile }: EvidenceUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      onUpload(files[0].name);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
          dragActive ? 'border-[#1E3A8A] bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">{label}</span>
        <span className="text-xs text-slate-500 mt-1">Drag & Drop files here</span>
        <span className="text-[10px] font-bold text-slate-400 mt-2">PDF • DOCX • XLSX • JPG • PNG</span>
        <button type="button" className="mt-3 px-4 py-1.5 border border-slate-300 bg-white text-[10px] font-black uppercase text-slate-600 rounded shadow-sm hover:text-[#1E3A8A] hover:border-[#1E3A8A]">
          + Upload Document
        </button>
        <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx,.xlsx,.jpg,.png" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {currentFile && (
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded border bg-white shadow-sm">
          {status === 'extracted' || status === 'verified' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-800 truncate">{currentFile}</span>
            <span className={`text-[9px] font-black uppercase tracking-wider ${
              status === 'extracted' ? 'text-emerald-700' : 
              status === 'verified' ? 'text-blue-700' : 'text-amber-700'
            }`}>
              {status === 'extracted' ? '✓ Extracted from file' : 
               status === 'verified' ? '✓ System Verified' : '⚠ Requires Review'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}