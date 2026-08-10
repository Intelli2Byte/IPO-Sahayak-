'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Trash2 } from 'lucide-react';

interface DocumentUploadZoneProps {
  documentType: string;
  title: string;
  description?: string;
  isOptional?: boolean;
  onUploadComplete: (data: any) => void;
  onDelete?: () => void;
  extractedData?: any;
  uploadedFile?: { name: string; size: number } | null;
  isProcessing?: boolean;
  error?: string | null;
}

/**
 * Reusable File Upload Row Component
 * 
 * Matches the UI specification:
 * - Card-based layout with rounded corners and light grey border
 * - Three states: Empty, Uploading, Uploaded
 * - Status icon on the left (empty square → green checkmark)
 * - Document title with optional "OPTIONAL" badge
 * - File details shown when uploaded
 * - Action buttons on the right (DROP/BROWSE + delete icon when uploaded)
 */

export default function DocumentUploadZone({
  documentType,
  title,
  description,
  isOptional = false,
  onUploadComplete,
  onDelete,
  extractedData,
  uploadedFile,
  isProcessing: externalProcessing,
  error: externalError,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getMockExtractedData = useCallback(() => {
    if (documentType === 'legal-disclosures') {
      return {
        documentType: 'legal-disclosures',
        litigationsCount: 26,
        taxDisputesCount: 200,
        aggregateTaxDisputesAmount: 108110000000,
        defaultComplianceStatus: 'NO DEFAULTS FOUND',
        narrative:
          'As of the date of this Draft Red Herring Prospectus, there are 26 outstanding civil/statutory proceedings and 200 pending tax disputes against the Company, aggregating to ₹108,110,000,000. The Company has not defaulted in the repayment of statutory dues, bank loans, or debentures. For further details, see "Outstanding Litigation and Material Developments" beginning on page [•].',
        affidavitSuggestions: {
          hasPendingLitigation: 'no',
          hasRegulatoryAction: 'yes',
          hasDefaultHistory: 'no',
        },
      };
    }

    return {
      documentType,
      status: 'Extracted',
    };
  }, [documentType]);

  const uploadFile = useCallback(
    async (file: File) => {
      const isPdf =
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setLocalError('Only PDF files are accepted.');
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        setLocalError('PDF must be smaller than 25 MB.');
        return;
      }

      setLocalError(null);
      setIsUploading(true);

      // Simulate 1-second AI extraction
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1000);
      });

      const extracted = getMockExtractedData();
      setIsUploading(false);

      onUploadComplete({
        ...extracted,
        file: {
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        },
      });
    },
    [getMockExtractedData, onUploadComplete]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void uploadFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const hasFile = Boolean(uploadedFile);
  const displayError = externalError || localError;
  const processing = isUploading || Boolean(externalProcessing);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!processing) {
          setIsDragging(true);
        }
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`
        flex items-center gap-4
        px-5 py-4
        border rounded-lg
        transition-all duration-200
        ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : hasFile
            ? 'border-slate-300 bg-white'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }
        ${processing ? 'cursor-wait opacity-70' : 'cursor-default'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileSelect}
        disabled={processing}
      />

      {/* LEFT: STATUS ICON */}
      <div className="shrink-0">
        {hasFile ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded border-2 border-slate-300" />
        )}
      </div>

      {/* MIDDLE: DOCUMENT INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-slate-800 truncate">{title}</h4>
          {isOptional && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              OPTIONAL
            </span>
          )}
        </div>

        {hasFile && uploadedFile ? (
          <p className="text-xs text-slate-500 truncate">
            {uploadedFile.name} · {formatFileSize(uploadedFile.size)}
          </p>
        ) : processing ? (
          <p className="text-xs text-amber-600 font-medium">
            AI is extracting structured data...
          </p>
        ) : displayError ? (
          <p className="text-xs text-red-600 font-medium">{displayError}</p>
        ) : description ? (
          <p className="text-xs text-slate-500">{description}</p>
        ) : null}
      </div>

      {/* RIGHT: ACTION BUTTONS */}
      <div className="flex items-center gap-2 shrink-0">
        {hasFile && onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={processing}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (!processing) {
              inputRef.current?.click();
            }
          }}
          disabled={processing}
          className="
            flex items-center gap-2
            px-4 py-2
            text-xs font-semibold
            text-slate-700
            bg-white
            border border-slate-300
            rounded-md
            hover:bg-slate-50
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <UploadCloud className="w-4 h-4" />
          <span>DROP / BROWSE</span>
        </button>
      </div>
    </div>
  );
}
