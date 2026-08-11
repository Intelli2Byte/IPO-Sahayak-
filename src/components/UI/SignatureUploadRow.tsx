'use client';

import { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Trash2 } from 'lucide-react';

interface SignatureUploadRowProps {
  title?: string;
  subtext?: string;
  accept?: string;
  fileName: string | null;
  onUpload: (fileName: string) => void;
  onDelete: () => void;
}

/**
 * Horizontal, card-based upload row for a single required document
 * (e.g. Signature Scan / DSC Token).
 *
 * States:
 * - Empty:     light-grey outlined square icon, subtext shows accepted formats.
 * - Completed: green checkmark circle, filename shown below title,
 *              a red trash icon appears next to the upload button.
 */
export default function SignatureUploadRow({
  title = 'Signature Scan / DSC Token',
  subtext = 'PNG, JPG, PDF',
  accept = '.png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf',
  fileName,
  onUpload,
  onDelete,
}: SignatureUploadRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hasFile = Boolean(fileName);

  const handleFile = (file: File) => {
    onUpload(file.name);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        w-full
        flex flex-row justify-between items-center
        px-6 py-4
        border rounded-lg
        bg-white
        transition-colors duration-200
        ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}
      `}
    >
      {/* LEFT + MIDDLE: Status Icon + Text */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Status Icon */}
        <div className="shrink-0">
          {hasFile ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-md border-2 border-slate-300" />
          )}
        </div>

        {/* Title + Subtext / Filename */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 font-sans truncate">{title}</p>
          {hasFile ? (
            <p className="text-xs text-slate-500 font-sans truncate mt-0.5">{fileName}</p>
          ) : (
            subtext && (
              <p className="text-xs text-slate-400 font-sans truncate mt-0.5">{subtext}</p>
            )
          )}
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
        />

        {hasFile && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            flex items-center gap-2
            px-4 py-2
            text-xs font-bold uppercase tracking-wide
            text-slate-700
            bg-white
            border border-slate-300
            rounded-md
            hover:bg-slate-50
            transition-colors
          "
        >
          <UploadCloud className="w-4 h-4" />
          <span>Drop / Browse</span>
        </button>
      </div>
    </div>
  );
}
