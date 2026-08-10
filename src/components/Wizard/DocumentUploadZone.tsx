'use client';

import { useCallback, useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface DocumentUploadZoneProps {
  documentType: string;
  title: string;
  description: string;
  onUploadComplete: (data: any) => void;
  extractedData?: any;
  isProcessing?: boolean;
  error?: string | null;
}

/**
 * IMPORTANT:
 *
 * This component intentionally does NOT call a real backend endpoint.
 * Document extraction is simulated locally so the UI works even when
 * no parser/API is running.
 *
 * Later, this can be replaced with a real API call without changing
 * the parent component interface.
 */

export default function DocumentUploadZone({
  documentType,
  title,
  description,
  onUploadComplete,
  extractedData,
  isProcessing: externalProcessing,
  error: externalError,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Fixed prototype extraction data.
   *
   * This is what appears after the 1-second "Just a sec..."
   * processing state, keyed by documentType.
   */
  const getMockExtractedData = useCallback(
    () => {
      if (documentType === 'board-resolution') {
        return {
          documentType: 'board-resolution',

          totalIssueSize: 20000000,

          fundingAllocations: [
            { purpose: 'Capital Expenditure', amount: 8000000, percentage: 40 },
            { purpose: 'Working Capital Requirements', amount: 6000000, percentage: 30 },
            { purpose: 'Debt Repayment', amount: 4000000, percentage: 20 },
            { purpose: 'General Corporate Purposes', amount: 2000000, percentage: 10 },
          ],

          deploymentSchedule: {
            fy2025: 5000000,
            fy2026: 3000000,
          },

          debtRepayment: {
            bankName: 'State Bank of India',
            loanAccount: '**********4452',
          },

          compliance: 'no',

          narrative:
            'The Net Proceeds are proposed to be utilized towards capital expenditure, working capital requirements, repayment of identified borrowings and general corporate purposes, in accordance with the objects approved by the Board.',
        };
      }

      if (documentType === 'auditor-certificate') {
        return {
          documentType: 'auditor-certificate',

          certificateStatus: 'Verified',

          certifiedIssueSize: 20000000,

          fundingAllocations: [
            { purpose: 'Capital Expenditure', amount: 8000000, percentage: 40 },
            { purpose: 'Working Capital Requirements', amount: 6000000, percentage: 30 },
            { purpose: 'Debt Repayment', amount: 4000000, percentage: 20 },
            { purpose: 'General Corporate Purposes', amount: 2000000, percentage: 10 },
          ],

          auditorObservation:
            'The proposed deployment of issue proceeds is consistent with the objects of the issue and the supporting Board Resolution.',
        };
      }

      if (documentType === 'risk-register') {
        return {
          documentType: 'risk-register',

          /**
           * 6.2 — Inherited Financial Risks
           * (mirrors Step 3 Financial Dossier extraction)
           */
          contingentLiabilitiesNotAcknowledged: 15021000000,
          outstandingIndebtednessFundBased: 851067000000,

          /**
           * 6.3 — AI-Drafted Core Risk Factors
           */
          risks: [
            {
              title: 'Regulatory & Spectrum Risk',
              description:
                'RJIL holds telecommunication licences and spectrum across different bands, frequencies and circles, which are subject to periodic renewal, regulatory conditions and government policy changes. Any adverse change in telecom regulations, spectrum allocation norms, or licence renewal terms could materially affect our operations and financial condition.',
              category: 'Regulatory',
            },
            {
              title: 'Related Party & Vendor Dependency Risk',
              description:
                'We rely on a limited group of passive infrastructure providers (e.g., SDIL, JDFPL) and related parties (RRL) for critical network infrastructure, tower access, fibre connectivity and retail distribution. Any disruption in these relationships or unfavourable renegotiation of terms could adversely impact our business operations and profitability.',
              category: 'Concentration',
            },
          ],

          /**
           * 6.4 — Materiality Thresholds
           */
          materialityThresholdPercent: 1,
          materialityThresholdAmount: 33597690,

          /**
           * 6.5 — Related Party Risks
           */
          relatedPartyRiskEntities: [
            'Reliance Retail Limited',
            'Summit Digitel Infrastructure',
          ],

          /**
           * 6.6 — Manual / cyber-tech risk suggestion
           */
          cyberTechRiskDescription:
            'We are transitioning from 4G to 5G SA networks, which carries deployment latency risks, potential service disruption during migration, and evolving cybersecurity threats associated with new network architecture and increased IoT device connectivity.',
        };
      }

      return {
        documentType,
        status: 'Extracted',
      };
    },
    [documentType]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      /**
       * Accept PDFs based on MIME type OR extension.
       *
       * Some browsers do not always populate File.type correctly,
       * especially with locally selected files.
       */
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setLocalError('Only PDF files are accepted.');
        setFileName(null);
        return;
      }

      /**
       * 25 MB prototype limit.
       */
      if (file.size > 25 * 1024 * 1024) {
        setLocalError('PDF must be smaller than 25 MB.');
        setFileName(null);
        return;
      }

      setLocalError(null);
      setFileName(file.name);
      setIsUploading(true);

      /**
       * Simulated AI/document extraction.
       *
       * Exactly 1 second so the UI can display:
       *
       * "Just a sec..."
       *
       * before revealing the extracted information.
       */
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1000);
      });

      const extracted = getMockExtractedData();

      setIsUploading(false);

      /**
       * Send the fixed extracted result to the parent panel.
       */
      onUploadComplete(extracted);
    },
    [getMockExtractedData, onUploadComplete]
  );

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      void uploadFile(file);
    }

    /**
     * Allows selecting the same file again.
     */
    e.target.value = '';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      void uploadFile(file);
    }
  };

  const hasData = Boolean(extractedData);

  const displayError =
    externalError || localError;

  const processing =
    isUploading || Boolean(externalProcessing);

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
      onClick={() => {
        if (!processing) {
          inputRef.current?.click();
        }
      }}
      className={`
        flex items-center gap-3
        rounded-lg
        border
        px-4 py-3
        transition-all
        duration-200
        ${
          processing
            ? 'cursor-wait border-amber-300 bg-amber-50'
            : isDragging
            ? 'cursor-pointer border-[#1E3A8A] bg-blue-50'
            : hasData
            ? 'cursor-pointer border-emerald-300 bg-emerald-50'
            : displayError
            ? 'cursor-pointer border-red-300 bg-red-50'
            : 'cursor-pointer border-slate-300 bg-slate-50 hover:border-[#1E3A8A]/50 hover:bg-slate-100'
        }
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

      {/* ICON */}
      <div
        className={`
          flex
          items-center
          justify-center
          w-9 h-9
          rounded-md
          shrink-0
          ${
            processing
              ? 'bg-amber-100'
              : hasData
              ? 'bg-emerald-100'
              : displayError
              ? 'bg-red-100'
              : 'bg-white border border-slate-200'
          }
        `}
      >
        {processing ? (
          <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
        ) : hasData ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : displayError ? (
          <XCircle className="w-4 h-4 text-red-600" />
        ) : (
          <UploadCloud className="w-4 h-4 text-slate-500" />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {processing ? (
          <>
            <p className="text-xs font-black text-amber-800 truncate">
              Just a sec…
            </p>

            <p className="text-[10px] text-amber-700 truncate">
              AI is reading {fileName || 'your document'} and extracting
              structured data.
            </p>
          </>
        ) : hasData ? (
          <>
            <p className="text-xs font-bold text-emerald-800 truncate">
              {fileName || 'Document'} analyzed successfully
            </p>

            <p className="text-[10px] text-emerald-700">
              Data extracted · Click to replace document
            </p>
          </>
        ) : displayError ? (
          <>
            <p className="text-xs font-bold text-red-700 truncate">
              {displayError}
            </p>

            <p className="text-[10px] text-red-600 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Click to try again
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold text-slate-700 truncate">
              {title}
            </p>

            <p className="text-[10px] text-slate-500 truncate">
              {description}
            </p>
          </>
        )}
      </div>

      {/* FILE TYPE */}
      {!processing &&
        !hasData &&
        !displayError && (
          <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            PDF · 25MB
          </span>
        )}

      {/* PROCESSING INDICATOR */}
      {processing && (
        <span className="text-[10px] font-black text-amber-700 shrink-0">
          EXTRACTING
        </span>
      )}
    </div>
  );
}
