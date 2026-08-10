'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Sparkles, Lock, ShieldCheck, Gavel, Info } from 'lucide-react';
import InkRadio from '../UI/InkRadio';
import InkCheckbox from '../UI/InkCheckbox';
import DocumentUploadZone from './DocumentUploadZone';
import {
  WizardFormData,
  PAPER_TEXTAREA,
  DEFAULT_LEGAL_DOCUMENTS,
  LegalDocumentUpload,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

function AffidavitQuestion({
  question,
  name,
  value,
  onChange,
}: {
  question: string;
  name: string;
  value: 'yes' | 'no' | '';
  onChange: (v: 'yes' | 'no') => void;
}) {
  return (
    <div className="affidavit-row">
      <p className="text-xs font-semibold text-slate-700 leading-relaxed flex-1 font-sans">
        {question}
      </p>
      <div className="flex items-center gap-5 shrink-0">
        <InkRadio
          name={name}
          value="yes"
          checked={value === 'yes'}
          onChange={() => onChange('yes')}
          label="Yes"
        />
        <InkRadio
          name={name}
          value="no"
          checked={value === 'no'}
          onChange={() => onChange('no')}
          label="No"
        />
      </div>
    </div>
  );
}

export default function PanelSeven_LegalDisclosures({ data, update }: PanelProps) {
  const splitScreenRef = useRef<HTMLDivElement>(null);
  const infoMessageRef = useRef<HTMLDivElement>(null);

  const [showInfoMessage, setShowInfoMessage] = useState(true);

  /**
   * Defensive fallback: if `data.legalDocuments` is missing (e.g. an
   * older autosaved session created before this field existed),
   * fall back to the default document list instead of crashing.
   */
  const legalDocuments: LegalDocumentUpload[] =
    data.legalDocuments && data.legalDocuments.length > 0
      ? data.legalDocuments
      : DEFAULT_LEGAL_DOCUMENTS;

  useEffect(() => {
    // Backfill the field into the wizard state once, so subsequent
    // renders/autosaves have it persisted going forward.
    if (!data.legalDocuments) {
      update('legalDocuments', DEFAULT_LEGAL_DOCUMENTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.legalDisclosuresExtractionStatus === 'done') {
      setShowInfoMessage(false);

      requestAnimationFrame(() => {
        if (splitScreenRef.current) {
          gsap.fromTo(
            splitScreenRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          );
        }
      });
    }
  }, [data.legalDisclosuresExtractionStatus]);

  const handleLegalDocUpload = (docId: string, extracted: any) => {
    const updatedDocs = legalDocuments.map((doc) =>
      doc.id === docId ? { ...doc, file: extracted.file } : doc
    );
    update('legalDocuments', updatedDocs);

    if (typeof extracted.litigationsCount === 'number') {
      update('litigationsCount', extracted.litigationsCount);
    }
    if (typeof extracted.taxDisputesCount === 'number') {
      update('taxDisputesCount', extracted.taxDisputesCount);
    }
    if (typeof extracted.aggregateTaxDisputesAmount === 'number') {
      update('aggregateTaxDisputesAmount', extracted.aggregateTaxDisputesAmount);
    }
    if (typeof extracted.defaultComplianceStatus === 'string') {
      update('defaultComplianceStatus', extracted.defaultComplianceStatus);
    }
    if (typeof extracted.narrative === 'string') {
      update('aiDraftedLitigationNarrative', extracted.narrative);
    }

    if (extracted.affidavitSuggestions) {
      if (!data.hasPendingLitigation && extracted.affidavitSuggestions.hasPendingLitigation) {
        update('hasPendingLitigation', extracted.affidavitSuggestions.hasPendingLitigation);
      }
      if (!data.hasRegulatoryAction && extracted.affidavitSuggestions.hasRegulatoryAction) {
        update('hasRegulatoryAction', extracted.affidavitSuggestions.hasRegulatoryAction);
      }
      if (!data.hasDefaultHistory && extracted.affidavitSuggestions.hasDefaultHistory) {
        update('hasDefaultHistory', extracted.affidavitSuggestions.hasDefaultHistory);
      }
    }

    const allRequiredUploaded = updatedDocs
      .filter((doc) => doc.required)
      .every((doc) => doc.file !== null);

    if (allRequiredUploaded) {
      update('legalDisclosuresExtractionStatus', 'done');
    }
  };

  const handleDeleteDoc = (docId: string) => {
    const updatedDocs = legalDocuments.map((doc) =>
      doc.id === docId ? { ...doc, file: null } : doc
    );
    update('legalDocuments', updatedDocs);

    const anyRequiredMissing = updatedDocs
      .filter((doc) => doc.required)
      .some((doc) => doc.file === null);

    if (anyRequiredMissing) {
      update('legalDisclosuresExtractionStatus', 'idle');
      setShowInfoMessage(true);
    }
  };

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow font-sans">Section VII</span>
        <h3 className="doc-section-title font-display">
          Legal Disclosures &amp; Compliance Declarations
        </h3>
        <p className="doc-section-sub font-sans">
          Upload your Secretarial Audit and Compliance Reports. The AI will extract your litigation
          metrics. Complete the official affidavits on the right to proceed.
        </p>
      </div>

      {/* 7.1 DOCUMENT INGESTION */}
      <div className="space-y-4">
        <span className="text-xs font-black text-slate-600 uppercase tracking-wider font-sans block">
          📂 7.1 — Document Ingestion (New Uploads Only)
        </span>

        <div className="space-y-3">
          {legalDocuments.map((doc) => (
            <DocumentUploadZone
              key={doc.id}
              documentType="legal-disclosures"
              title={doc.label}
              isOptional={!doc.required}
              onUploadComplete={(extracted) => handleLegalDocUpload(doc.id, extracted)}
              onDelete={() => handleDeleteDoc(doc.id)}
              uploadedFile={doc.file}
              extractedData={doc.file ? { ok: true } : null}
            />
          ))}
        </div>

        {showInfoMessage && data.legalDisclosuresExtractionStatus !== 'done' && (
          <div
            ref={infoMessageRef}
            className="p-3.5 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2.5 text-xs text-blue-800 font-semibold font-sans"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Once uploaded, the AI will automatically fill the litigation metrics and draft the
              narrative below �� no manual entry required for those fields.
            </span>
          </div>
        )}
      </div>

      {/* SPLIT-SCREEN REVEAL */}
      {data.legalDisclosuresExtractionStatus === 'done' && (
        <div
          ref={splitScreenRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t-2 border-slate-200 pt-8"
        >
          {/* LEFT COLUMN — AI EXTRACTED LITIGATION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-sans">
                ⚡ AI Extracted Litigation
              </span>
            </div>

            {/* 7.2 COMPANY LITIGATION METRICS */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-sans">
                🔒 7.2 — Company Litigation Metrics
              </p>
              <p className="text-[10px] text-slate-500 font-semibold font-sans">
                Extracted from Secretarial Audit Report
              </p>

              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-sans">
                    Total Litigations Involving the Company
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={data.litigationsCount}
                      className="w-full pl-4 pr-9 py-3 text-sm border border-slate-300 rounded-md bg-slate-100 font-mono font-bold text-slate-700 outline-none cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-sans">
                    Pending Tax Disputes
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={data.taxDisputesCount}
                      className="w-full pl-4 pr-9 py-3 text-sm border border-slate-300 rounded-md bg-slate-100 font-mono font-bold text-slate-700 outline-none cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-sans">
                    Aggregate Amount Involved in Tax Disputes
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-sm font-extrabold text-slate-400">₹</span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={data.aggregateTaxDisputesAmount.toLocaleString('en-IN')}
                      className="w-full pl-8 pr-9 py-3 text-sm border border-slate-300 rounded-md bg-slate-100 font-mono font-bold text-slate-700 outline-none cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* 7.3 DEFAULT & COMPLIANCE STATUS */}
            <div className="space-y-3 border-t border-slate-200/70 pt-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans">
                  🔒 7.3 — Default &amp; Compliance Status
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold font-sans">
                Has the company defaulted on repayment of statutory dues, loans, or debentures?
              </p>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={data.defaultComplianceStatus}
                  className={`w-full pl-4 pr-9 py-3 text-sm border border-slate-300 rounded-md bg-slate-100 font-mono font-bold outline-none cursor-not-allowed ${
                    data.defaultComplianceStatus === 'NO DEFAULTS FOUND'
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* AI-DRAFTED LITIGATION NARRATIVE */}
            <div className="space-y-3 border-t border-slate-200/70 pt-5">
              <div className="flex items-center gap-2">
                <Gavel className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans">
                  ✍️ AI-Drafted Litigation Narrative
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-wide rounded font-sans">
                  🤖 AI Drafted
                </span>
              </div>
              <textarea
                rows={5}
                value={data.aiDraftedLitigationNarrative}
                onChange={(e) => update('aiDraftedLitigationNarrative', e.target.value)}
                className={PAPER_TEXTAREA}
              />
            </div>
          </div>

          {/* RIGHT COLUMN — MANUAL AFFIDAVITS */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-sans">
                📝 Manual Affidavits
              </span>
            </div>

            {/* 7.4 MANUAL DISCLOSURE CHECKS */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans block">
                ⚖️ 7.4 — Manual Disclosure Checks
              </span>
              <p className="text-xs text-slate-600 font-semibold font-sans">
                Please verify the following scenarios involving Promoters or Directors:
              </p>

              <div className="affidavit-block">
                <AffidavitQuestion
                  question="Are there any pending criminal litigations against Directors?"
                  name="pendingLitigation"
                  value={data.hasPendingLitigation}
                  onChange={(v) => update('hasPendingLitigation', v)}
                />
                <AffidavitQuestion
                  question="Has the company or promoters been subject to SEBI/RBI action?"
                  name="regulatoryAction"
                  value={data.hasRegulatoryAction}
                  onChange={(v) => update('hasRegulatoryAction', v)}
                />
                <AffidavitQuestion
                  question="Have Promoters defaulted on statutory dues, bank loans, or debentures?"
                  name="defaultHistory"
                  value={data.hasDefaultHistory}
                  onChange={(v) => update('hasDefaultHistory', v)}
                />
              </div>
            </div>

            {/* 7.5 COMPLIANCE CONFIRMATIONS */}
            <div className="space-y-3 border-t border-slate-200/70 pt-6">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans block">
                ✅ 7.5 — Compliance Confirmations
              </span>
              <p className="text-xs text-slate-600 font-semibold font-sans">
                Tick to confirm as the filing officer:
              </p>
              <div className="space-y-2 border border-slate-200 rounded-md p-3.5 bg-[#fffdf8]">
                <InkCheckbox
                  checked={data.complianceCheck1}
                  onChange={(v) => update('complianceCheck1', v)}
                  label="All statutory filings under the Companies Act, 2013 are current and up to date."
                />
                <InkCheckbox
                  checked={data.complianceCheck2}
                  onChange={(v) => update('complianceCheck2', v)}
                  label="The company has obtained all material licenses and regulatory approvals required for its operations."
                />
                <InkCheckbox
                  checked={data.complianceCheck3}
                  onChange={(v) => update('complianceCheck3', v)}
                  label="No material adverse event has occurred since the date of the last audited financial statements."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
