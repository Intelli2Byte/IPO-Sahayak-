'use client';

import { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  LockKeyhole,
  Building2,
  Scale,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';
import gsap from 'gsap';

import PaperStamp from '../ui/PaperStamp';
import DocumentUploadZone from './DocumentUploadZone';
import {
  WizardFormData,
  DEFAULT_WIZARD_DATA,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(
    field: K,
    value: WizardFormData[K]
  ) => void;
  errors: Record<string, string>;
}

interface ExtractedDocument {
  documentType: string;
  fileName: string;
  data: any;
}

interface DeploymentSchedule {
  fy2025: number;
  fy2026: number;
}

interface DebtRepayment {
  bankName: string;
  loanAccount: string;
}

const FIXED_DEPLOYMENT: DeploymentSchedule = {
  fy2025: 5000000,
  fy2026: 3000000,
};

const FIXED_DEBT_REPAYMENT: DebtRepayment = {
  bankName: 'State Bank of India',
  loanAccount: '**********4452',
};

const FIXED_NARRATIVE =
  'The Net Proceeds are proposed to be utilized towards capital expenditure, working capital requirements, repayment of identified borrowings and general corporate purposes, in accordance with the objects approved by the Board.';

const FIXED_COMPLIANCE = 'no';

function formatINR(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatLakhs(value: number) {
  return `₹${(value / 100000).toFixed(1)}L`;
}

export default function PanelFive_UseOfFundsLedger({
  data,
  update,
}: PanelProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const [boardResolution, setBoardResolution] =
    useState<ExtractedDocument | null>(null);

  const [auditorCertificate, setAuditorCertificate] =
    useState<ExtractedDocument | null>(null);

  const [showExtractedPanel, setShowExtractedPanel] =
    useState(false);

  const [isExtracting, setIsExtracting] =
    useState(false);

  const [deploymentSchedule, setDeploymentSchedule] =
    useState<DeploymentSchedule>(FIXED_DEPLOYMENT);

  const [debtRepayment, setDebtRepayment] =
    useState<DebtRepayment>(FIXED_DEBT_REPAYMENT);

  const [complianceAnswer, setComplianceAnswer] =
    useState(FIXED_COMPLIANCE);

  const [narrative, setNarrative] =
    useState(FIXED_NARRATIVE);

  const totalIssueSize =
    data.totalIssueSize || 20000000;

  const currentSum =
    data.fundingAllocations.reduce(
      (acc, item) => acc + item.amount,
      0
    );

  const isBalanced =
    currentSum === totalIssueSize;

  const hasUploadedDocuments =
    Boolean(boardResolution || auditorCertificate);

  /**
   * Handles extraction result coming from DocumentUploadZone.
   */
  const handleDocumentExtracted = (
    documentType: string,
    fileName: string,
    extractedData: any
  ) => {
    const extracted: ExtractedDocument = {
      documentType,
      fileName,
      data: extractedData,
    };

    if (documentType === 'board-resolution') {
      setBoardResolution(extracted);
    }

    if (documentType === 'auditor-certificate') {
      setAuditorCertificate(extracted);
    }

    /**
     * Immediately populate the ledger from extracted data.
     */
    if (
      extractedData?.fundingAllocations &&
      Array.isArray(
        extractedData.fundingAllocations
      )
    ) {
      update(
        'fundingAllocations',
        extractedData.fundingAllocations
      );
    }

    if (extractedData?.deploymentSchedule) {
      setDeploymentSchedule(
        extractedData.deploymentSchedule
      );
    }

    if (extractedData?.debtRepayment) {
      setDebtRepayment(
        extractedData.debtRepayment
      );
    }

    if (extractedData?.compliance) {
      setComplianceAnswer(
        extractedData.compliance
      );
    }

    if (extractedData?.narrative) {
      setNarrative(
        extractedData.narrative
      );
    }
  };

  /**
   * Main extraction button.
   *
   * The user uploads one or both documents first.
   * Clicking this button reveals the split-screen.
   */
  const handleExtract = async () => {
    if (!hasUploadedDocuments) {
      return;
    }

    setIsExtracting(true);

    /**
     * Give the UI a short "AI processing" state.
     */
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1000);
    });

    /**
     * Fixed prototype ledger.
     */
    const fixedAllocations =
      DEFAULT_WIZARD_DATA.fundingAllocations.map(
        (item) => ({
          ...item,
        })
      );

    update(
      'fundingAllocations',
      fixedAllocations
    );

    setDeploymentSchedule(
      FIXED_DEPLOYMENT
    );

    setDebtRepayment(
      FIXED_DEBT_REPAYMENT
    );

    setComplianceAnswer(
      FIXED_COMPLIANCE
    );

    setNarrative(
      FIXED_NARRATIVE
    );

    setIsExtracting(false);
    setShowExtractedPanel(true);

    /**
     * Reveal animation.
     */
    requestAnimationFrame(() => {
      if (!formRef.current) return;

      gsap.fromTo(
        formRef.current.querySelectorAll(
          '.extracted-reveal'
        ),
        {
          opacity: 0,
          y: 16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
        }
      );
    });
  };

  const handleAmountChange = (
    index: number,
    valStr: string
  ) => {
    const cleanVal =
      parseInt(
        valStr.replace(/[^0-9]/g, '')
      ) || 0;

    const updated = [
      ...data.fundingAllocations,
    ];

    updated[index] = {
      ...updated[index],
      amount: cleanVal,
      percentage:
        totalIssueSize > 0
          ? Math.round(
              (cleanVal /
                totalIssueSize) *
                100
            )
          : 0,
    };

    update(
      'fundingAllocations',
      updated
    );
  };

  const handleReset = () => {
    update(
      'fundingAllocations',
      DEFAULT_WIZARD_DATA.fundingAllocations
    );

    setDeploymentSchedule(
      FIXED_DEPLOYMENT
    );

    setDebtRepayment(
      FIXED_DEBT_REPAYMENT
    );

    setComplianceAnswer(
      FIXED_COMPLIANCE
    );

    setNarrative(
      FIXED_NARRATIVE
    );

    if (formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll(
          '.allocation-input'
        ),
        {
          scale: 0.98,
          opacity: 0.8,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }
  };

  const chartData = useMemo(
    () =>
      data.fundingAllocations.map(
        (item) => ({
          ...item,
        })
      ),
    [data.fundingAllocations]
  );

  return (
    <div
      ref={formRef}
      className="space-y-8"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-200 pb-6">
        <span className="block text-[10px] font-black text-[#1E3A8A] uppercase tracking-[0.22em] mb-2 font-display">
          Section V
        </span>

        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-display">
          Objects of the Issue (Use of Funds)
        </h3>

        <p className="mt-2 max-w-3xl text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
          Distribute the total issue proceeds across purposes.
          The ledger must balance to exactly 100% before you
          can proceed.
        </p>
      </div>

      {/* =====================================================
          5.1 DOCUMENT INGESTION
      ===================================================== */}

      {!showExtractedPanel && (
        <div className="border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-display">
                5.1 — Document Ingestion
              </p>

              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                Upload supporting documents to automatically
                populate the Use of Funds ledger.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              AI Extraction
            </div>
          </div>

          <div className="space-y-3">
            <DocumentUploadZone
              documentType="board-resolution"
              title="Board Resolution - Objects of the Issue"
              description="Upload the Board Resolution approving the objects and deployment of issue proceeds."
              extractedData={
                boardResolution?.data
              }
              onUploadComplete={(
                extracted
              ) => {
                handleDocumentExtracted(
                  'board-resolution',
                  boardResolution?.fileName ||
                    'Board Resolution.pdf',
                  extracted
                );
              }}
            />

            <DocumentUploadZone
              documentType="auditor-certificate"
              title="Independent Auditor's Certificate on Utilisation"
              description="Optional supporting certificate confirming the proposed utilization of issue proceeds."
              extractedData={
                auditorCertificate?.data
              }
              onUploadComplete={(
                extracted
              ) => {
                handleDocumentExtracted(
                  'auditor-certificate',
                  auditorCertificate?.fileName ||
                    "Auditor's Certificate.pdf",
                  extracted
                );
              }}
            />
          </div>

          {/* UPLOAD / EXTRACT BUTTON */}

          <div className="mt-5">
            <button
              type="button"
              disabled={
                !hasUploadedDocuments ||
                isExtracting
              }
              onClick={
                handleExtract
              }
              className={`
                w-full
                h-11
                flex
                items-center
                justify-center
                gap-2
                rounded-md
                text-xs
                font-black
                uppercase
                tracking-wide
                transition-all
                font-display
                ${
                  !hasUploadedDocuments ||
                  isExtracting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#8B00FF] to-[#5433FF] text-white hover:shadow-lg hover:shadow-purple-200 active:scale-[0.995]'
                }
              `}
            >
              {isExtracting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Just a sec…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Upload & Extract Data
                </>
              )}
            </button>
          </div>

          {!hasUploadedDocuments && (
            <p className="mt-3 text-center text-[10px] text-slate-400 font-sans">
              Upload at least one supporting document to
              enable extraction.
            </p>
          )}
        </div>
      )}

      {/* =====================================================
          EXTRACTED SPLIT SCREEN
      ===================================================== */}

      {showExtractedPanel && (
        <div className="extracted-reveal">
          {/* SUCCESS BANNER */}

          <div className="mb-6 flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-black text-emerald-800 font-display">
                AI extraction completed
              </p>

              <p className="text-[10px] text-emerald-700 font-sans">
                Structured Use of Funds data has been extracted
                from the uploaded document.
              </p>
            </div>
          </div>

          {/* SPLIT SCREEN */}

          <div className="grid grid-cols-1 xl:grid-cols-2 border border-slate-200 bg-white">
            {/* =================================================
                LEFT — AI EXTRACTED LEDGER
            ================================================= */}

            <div className="p-5 md:p-6 border-b xl:border-b-0 xl:border-r border-slate-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="w-4 h-4 text-[#1E3A8A]" />

                    <p className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-wider font-display">
                      AI Extracted Ledger
                    </p>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-500 font-sans">
                    5.2 — Use of Funds Allocation
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[9px] font-black text-emerald-700 uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Balanced
                </span>
              </div>

              {/* TOTAL */}

              <div className="mb-5 rounded-md bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-display">
                  Total to Distribute
                </p>

                <p className="mt-1 text-xl font-black text-slate-900 font-mono">
                  {formatINR(
                    totalIssueSize
                  )}
                </p>

                <p className="text-[9px] text-slate-500 mt-1 font-sans">
                  Source: Issue Size from Step 2
                </p>
              </div>

              {/* ALLOCATIONS */}

              <div className="space-y-5">
                {chartData.map(
                  (item, index) => (
                    <div
                      key={
                        item.purpose
                      }
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-wider font-display">
                          {
                            item.purpose
                          }
                        </label>

                        <span className="text-[11px] font-black text-[#1E3A8A] font-mono">
                          {
                            item.percentage
                          }
                          %
                        </span>
                      </div>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 font-mono">
                          ₹
                        </span>

                        <input
                          type="text"
                          value={item.amount.toLocaleString(
                            'en-IN'
                          )}
                          onChange={(
                            e
                          ) =>
                            handleAmountChange(
                              index,
                              e.target.value
                            )
                          }
                          className="allocation-input w-full pl-8 pr-12 py-3 border border-slate-300 rounded-md bg-[#fffdf8] text-sm font-black text-slate-800 font-mono outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-50"
                        />

                        <LockKeyhole className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E3A8A] rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                item.percentage,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* BALANCE */}

              <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                <div>
                  <p className="text-xs font-black text-emerald-800 font-display">
                    LEDGER BALANCED
                  </p>

                  <p className="text-[10px] text-emerald-700 font-sans">
                    Total allocation equals exactly 100%.
                  </p>
                </div>
              </div>

              {/* NARRATIVE */}

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B00FF]" />

                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-display">
                    5.6 — AI-Drafted Narrative
                  </p>

                  <span className="ml-auto rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[8px] font-black text-purple-700">
                    AI DRAFTED
                  </span>
                </div>

                <div className="border border-slate-200 bg-[#fffdf8] rounded-md p-4">
                  <p className="text-[11px] leading-relaxed text-slate-600 font-sans">
                    {narrative}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT — DEPLOYMENT & COMPLIANCE
            ================================================= */}

            <div className="p-5 md:p-6 bg-[#fcfcfd]">
              {/* DEPLOYMENT */}

              <section className="extracted-reveal">
                <div className="flex items-start gap-2 mb-4">
                  <CalendarDays className="w-4 h-4 text-[#1E3A8A] mt-0.5" />

                  <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider font-display">
                      5.3 — Deployment Schedule
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1 font-sans">
                      How will the ₹80.0L Capex be deployed?
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-md bg-white overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-slate-200">
                    <div className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase font-display">
                      Financial Year
                    </div>

                    <div className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase font-display border-l border-slate-200">
                      Amount (₹)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 border-b border-slate-200">
                    <div className="px-4 py-3 text-xs font-bold text-slate-700">
                      FY 2025
                    </div>

                    <div className="px-4 py-2 border-l border-slate-200">
                      <input
                        value={deploymentSchedule.fy2025.toLocaleString(
                          'en-IN'
                        )}
                        onChange={(e) =>
                          setDeploymentSchedule(
                            (prev) => ({
                              ...prev,
                              fy2025:
                                parseInt(
                                  e.target.value.replace(
                                    /[^0-9]/g,
                                    ''
                                  )
                                ) || 0,
                            })
                          )
                        }
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-[#fffdf8] text-xs font-black font-mono text-slate-800 outline-none focus:border-[#1E3A8A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-4 py-3 text-xs font-bold text-slate-700">
                      FY 2026
                    </div>

                    <div className="px-4 py-2 border-l border-slate-200">
                      <input
                        value={deploymentSchedule.fy2026.toLocaleString(
                          'en-IN'
                        )}
                        onChange={(e) =>
                          setDeploymentSchedule(
                            (prev) => ({
                              ...prev,
                              fy2026:
                                parseInt(
                                  e.target.value.replace(
                                    /[^0-9]/g,
                                    ''
                                  )
                                ) || 0,
                            })
                          )
                        }
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-[#fffdf8] text-xs font-black font-mono text-slate-800 outline-none focus:border-[#1E3A8A]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* DEBT REPAYMENT */}

              <section className="mt-8 extracted-reveal">
                <div className="flex items-start gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-[#1E3A8A] mt-0.5" />

                  <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider font-display">
                      5.4 — Debt Repayment Details
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1 font-sans">
                      Which specific bank is being repaid with
                      the ₹40.0L allocation?
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-md bg-white p-4 space-y-3">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Bank Name
                    </label>

                    <input
                      value={
                        debtRepayment.bankName
                      }
                      onChange={(e) =>
                        setDebtRepayment(
                          (prev) => ({
                            ...prev,
                            bankName:
                              e.target.value,
                          })
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded bg-[#fffdf8] text-xs font-bold text-slate-800 outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Loan Account Number
                    </label>

                    <input
                      value={
                        debtRepayment.loanAccount
                      }
                      onChange={(e) =>
                        setDebtRepayment(
                          (prev) => ({
                            ...prev,
                            loanAccount:
                              e.target.value,
                          })
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded bg-[#fffdf8] text-xs font-black font-mono text-slate-800 outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>
              </section>

              {/* COMPLIANCE */}

              <section className="mt-8 extracted-reveal">
                <div className="flex items-start gap-2 mb-4">
                  <Scale className="w-4 h-4 text-[#1E3A8A] mt-0.5" />

                  <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider font-display">
                      5.5 — SEBI Compliance Check
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1 font-sans">
                      Will proceeds be utilized for the benefit
                      of Promoters / Group Entities?
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-md bg-white p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setComplianceAnswer(
                          'yes'
                        )
                      }
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-[10px] font-black uppercase transition-colors ${
                        complianceAnswer ===
                        'yes'
                          ? 'border-red-300 bg-red-50 text-red-700'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border ${
                          complianceAnswer ===
                          'yes'
                            ? 'border-red-600 bg-red-600'
                            : 'border-slate-300'
                        }`}
                      />
                      YES
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setComplianceAnswer(
                          'no'
                        )
                      }
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-[10px] font-black uppercase transition-colors ${
                        complianceAnswer ===
                        'no'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border ${
                          complianceAnswer ===
                          'no'
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-slate-300'
                        }`}
                      />
                      NO
                    </button>
                  </div>

                  {complianceAnswer ===
                    'no' && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      No promoter/group-entity benefit detected.
                      Compliant.
                    </div>
                  )}

                  {complianceAnswer ===
                    'yes' && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-red-700">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Compliance review required.
                    </div>
                  )}
                </div>
              </section>

              {/* SOURCE DOCUMENTS */}

              <section className="mt-8 extracted-reveal">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-display mb-2">
                  Source Documents
                </p>

                <div className="space-y-2">
                  {boardResolution && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">
                        {boardResolution.fileName}
                      </span>
                    </div>
                  )}

                  {auditorCertificate && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">
                        {
                          auditorCertificate.fileName
                        }
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* RESET / REPROCESS */}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-md text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 font-display"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Ledger
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          VALIDATION
      ===================================================== */}

      {!isBalanced &&
        showExtractedPanel && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-red-700 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

            <span className="font-sans">
              Allocated sum (
              <span className="font-mono font-black">
                {formatINR(currentSum)}
              </span>
              ) does not match total issue size (
              <span className="font-mono font-black">
                {formatINR(totalIssueSize)}
              </span>
              ).
            </span>
          </div>
        )}

      {/* =====================================================
          BALANCE FOOTER
      ===================================================== */}

      {showExtractedPanel && (
        <div className="ledger-summary flex flex-col sm:flex-row justify-between gap-4 mt-5 pt-5 border-t border-slate-200">
          <div>
            <span className="ledger-label block text-[9px] font-black text-slate-400 uppercase tracking-wider font-display">
              Allocated Balance
            </span>

            <span
              className={`ledger-value text-lg font-black font-mono ${
                isBalanced
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}
            >
              {formatINR(currentSum)}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="ledger-label block text-[9px] font-black text-slate-400 uppercase tracking-wider font-display">
              Required Target
            </span>

            <span className="ledger-value text-lg font-black font-mono text-slate-800">
              {formatINR(totalIssueSize)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function useOfFundsIsBalanced(
  data: WizardFormData
) {
  const sum =
    data.fundingAllocations.reduce(
      (acc, item) => acc + item.amount,
      0
    );

  return (
    sum === data.totalIssueSize
  );
}