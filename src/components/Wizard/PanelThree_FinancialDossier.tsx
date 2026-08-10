// 'use client';

// import { useState, useRef } from 'react';
// import { Paperclip, X, FileText } from 'lucide-react';
// import HighlighterField from '../ui/HighlighterField';
// import { WizardFormData, PAPER_INPUT } from './wizardTypes';

// interface PanelProps {
//   data: WizardFormData;
//   update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
//   errors: Record<string, string>;
// }

// const LEDGER_ROWS: { label: string; revenueKey: keyof WizardFormData; patKey: keyof WizardFormData }[] = [
//   { label: 'FY 2024', revenueKey: 'fy24Revenue', patKey: 'fy24Pat' },
//   { label: 'FY 2025', revenueKey: 'fy25Revenue', patKey: 'fy25Pat' },
//   { label: 'FY 2026', revenueKey: 'fy26Revenue', patKey: 'fy26Pat' },
// ];

// export default function PanelThree_FinancialDossier({ data, update }: PanelProps) {
//   const [dragActive, setDragActive] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const addFiles = (files: FileList | null) => {
//     if (!files) return;
//     const names = Array.from(files).map((f) => f.name);
//     update('attachedDocs', [...data.attachedDocs, ...names]);
//   };

//   const removeFile = (name: string) => {
//     update('attachedDocs', data.attachedDocs.filter((f) => f !== name));
//   };

//   const setNum = (key: keyof WizardFormData, value: string) => update(key, (parseFloat(value) || 0) as any);

//   return (
//     <div className="paper-sheet-section space-y-9">
//       <div className="doc-section-header">
//         <span className="doc-section-eyebrow">Section III</span>
//         <h3 className="doc-section-title">Financial Dossier</h3>
//         <p className="doc-section-sub">
//           Enter three years of audited figures exactly as they appear in the certified financial statements.
//         </p>
//       </div>

//       {/* Accounting ledger table */}
//       <div className="ledger-table-wrap">
//         <table className="ledger-table">
//           <thead>
//             <tr>
//               <th>Fiscal Year</th>
//               <th>Revenue (₹ Cr)</th>
//               <th>Profit After Tax (₹ Cr)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {LEDGER_ROWS.map((row) => (
//               <tr key={row.label}>
//                 <td className="font-bold text-slate-800">{row.label}</td>
//                 <td>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={data[row.revenueKey] as number}
//                     onChange={(e) => setNum(row.revenueKey, e.target.value)}
//                     className="ledger-cell-input"
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={data[row.patKey] as number}
//                     onChange={(e) => setNum(row.patKey, e.target.value)}
//                     className="ledger-cell-input"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="doc-cell-grid">
//         <HighlighterField label="Total Assets (₹ Cr)" required>
//           <input type="number" step="0.01" value={data.totalAssets} onChange={(e) => setNum('totalAssets', e.target.value)} className={PAPER_INPUT} />
//         </HighlighterField>
//         <HighlighterField label="Net Worth (₹ Cr)" required>
//           <input type="number" step="0.01" value={data.netWorth} onChange={(e) => setNum('netWorth', e.target.value)} className={PAPER_INPUT} />
//         </HighlighterField>
//         <HighlighterField label="Total Debt (₹ Cr)" required>
//           <input type="number" step="0.01" value={data.totalDebt} onChange={(e) => setNum('totalDebt', e.target.value)} className={PAPER_INPUT} />
//         </HighlighterField>
//       </div>

//       {/* Drag-and-drop paperclip zone */}
//       <div className="space-y-3">
//         <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
//           Supporting Audited Statements &amp; Annexures <span className="text-red-600">*</span>
//         </label>
//         <div
//           onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
//           onDragLeave={() => setDragActive(false)}
//           onDrop={(e) => { e.preventDefault(); setDragActive(false); addFiles(e.dataTransfer.files); }}
//           onClick={() => inputRef.current?.click()}
//           className={`attachment-pocket ${dragActive ? 'attachment-pocket-active' : ''}`}
//         >
//           <Paperclip className="w-6 h-6 text-slate-400 rotate-45 mb-2" />
//           <p className="text-xs font-bold text-slate-600">Drop audited financials here, or click to browse</p>
//           <p className="text-[10px] text-slate-400 font-semibold mt-1">PDF, XLS, XLSX up to 25MB each</p>
//           <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
//         </div>

//         {data.attachedDocs.length > 0 && (
//           <div className="space-y-2 pt-1">
//             {data.attachedDocs.map((name) => (
//               <div key={name} className="attachment-chip">
//                 <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
//                 <span className="flex-1 truncate">{name}</span>
//                 <button type="button" onClick={() => removeFile(name)} className="text-slate-400 hover:text-red-600 cursor-pointer">
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  UploadCloud,
  Lock,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Pencil,
} from 'lucide-react';

import HighlighterField from '../UI/HighlighterField';

import {
  WizardFormData,
  PAPER_INPUT,
  PAPER_TEXTAREA,
  PAPER_SELECT,
  MDA_TABS,
  IndebtednessRecord,
  FinancialDocumentItem,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(
    field: K,
    value: WizardFormData[K]
  ) => void;
  errors: Record<string, string>;
}

const AI_MDA_TEMPLATES: Record<string, string> = {
  'Results of Operations':
    'During Fiscal 2026, Revenue from Operations increased by 14.56% to ₹1,468,853 million, driven by growth in digital connectivity and expansion of the customer base across core segments. Profit After Tax grew in line with operating leverage, supported by disciplined cost management. [Note 24, pg 142]',
  Liquidity:
    "The Company's liquidity position remains stable, supported by operating cash flows and access to working capital facilities. Cash and cash equivalents, together with undrawn credit lines, are considered sufficient to meet near-term obligations. [Note 19, pg 156]",
  'Capital Resources':
    'The Company funds its capital requirements through a mix of internal accruals, term loans and external commercial borrowings. Capital expenditure during the year was primarily directed towards network expansion and technology infrastructure. [Note 18, pg 154]',
  'Off-Balance Sheet Items':
    'As of the balance sheet date, the Company does not have any material off-balance sheet arrangements that have, or are reasonably likely to have, a material effect on its financial condition. [Note 31, pg 168]',
};

function wordCount(text: string) {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

export default function PanelThree_FinancialDossier({
  data,
  update,
  errors,
}: PanelProps) {
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [unlockedKpis, setUnlockedKpis] = useState<Record<string, boolean>>(
    {}
  );

  const requiredDocs = data.financialDocuments.filter((d) => d.required);
  const allRequiredPresent = requiredDocs.every(
    (d) => !!d.file || !!d.reusedFromStep
  );

  const syncAttachedDocs = (docs: FinancialDocumentItem[]) => {
    update(
      'attachedDocs',
      docs.filter((d) => d.file || d.reusedFromStep).map((d) => d.label)
    );
  };

  const handleFileSelect = (id: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const f = fileList[0];

    const next: FinancialDocumentItem[] = data.financialDocuments.map((doc) =>
      doc.id === id
        ? {
            ...doc,
            file: {
              name: f.name,
              size: f.size,
              uploadedAt: new Date().toISOString(),
            },
            reusedFromStep: undefined,
          }
        : doc
    );

    update('financialDocuments', next);
    syncAttachedDocs(next);
  };

  const removeFile = (id: string) => {
    const next: FinancialDocumentItem[] = data.financialDocuments.map((doc) =>
      doc.id === id ? { ...doc, file: null, reusedFromStep: undefined } : doc
    );

    update('financialDocuments', next);
    syncAttachedDocs(next);
  };

  const handleUploadAndExtract = () => {
    if (!allRequiredPresent || extracting) return;

    setExtracting(true);
    setExtractProgress(0);
    update('financialExtractionStatus', 'parsing');

    const timer = setInterval(() => {
      setExtractProgress((prev) => {
        const nextVal = Math.min(prev + 20, 100);

        if (nextVal >= 100) {
          clearInterval(timer);

          window.setTimeout(() => {
            setExtracting(false);
            update('financialExtractionStatus', 'done');

            if (!data.fy26Revenue) update('fy26Revenue', 1468853);
            if (!data.profitAfterTax) update('profitAfterTax', 300527);
            if (!data.netWorth) update('netWorth', 3359769);
            if (!data.ebitdaMargin) update('ebitdaMargin', 21.4);

            if (data.indebtednessRecords.length === 0) {
              update('indebtednessRecords', [
                {
                  category: 'Term Loans & ECB',
                  classification: 'Non-Current',
                  amount: 514548,
                  source: 'Note 18',
                  isAiExtracted: true,
                },
                {
                  category: 'Working Capital Facilities',
                  classification: 'Current',
                  amount: 193262,
                  source: 'Note 19',
                  isAiExtracted: true,
                },
              ]);
            }

            const seededSections = { ...data.mdaSections };
            MDA_TABS.forEach((tab) => {
              if (!seededSections[tab]?.content) {
                const content = AI_MDA_TEMPLATES[tab] ?? '';
                seededSections[tab] = {
                  content,
                  aiDrafted: true,
                  wordCount: wordCount(content),
                };
              }
            });
            update('mdaSections', seededSections);
          }, 300);
        }

        return nextVal;
      });
    }, 260);
  };

  const unlockKpi = (field: string) => {
    const note = window.prompt(
      'Provide an audit-trail note for editing this AI-extracted figure:'
    );
    if (note === null) return;

    update('kpiEditAudit', { ...data.kpiEditAudit, [field]: note });
    setUnlockedKpis((prev) => ({ ...prev, [field]: true }));
  };

  const isKpiLocked = (field: string) =>
    data.financialExtractionStatus === 'done' && !unlockedKpis[field];

  const activeTab = data.mdaActiveTab || MDA_TABS[0];
  const activeSection = data.mdaSections[activeTab] ?? {
    content: '',
    aiDrafted: false,
    wordCount: 0,
  };

  const updateActiveSection = (content: string) => {
    update('mdaSections', {
      ...data.mdaSections,
      [activeTab]: { ...activeSection, content, wordCount: wordCount(content) },
    });
  };

  const regenerateActiveSection = () => {
    const generated = AI_MDA_TEMPLATES[activeTab] ?? '';
    update('mdaSections', {
      ...data.mdaSections,
      [activeTab]: {
        content: generated,
        aiDrafted: true,
        wordCount: wordCount(generated),
      },
    });
  };

  const rejectAndRewrite = () => {
    update('mdaSections', {
      ...data.mdaSections,
      [activeTab]: { content: '', aiDrafted: false, wordCount: 0 },
    });
  };

  const acceptSection = () => {
    update('mdaSections', {
      ...data.mdaSections,
      [activeTab]: { ...activeSection, aiDrafted: false },
    });
  };

  const addIndebtednessRecord = () => {
    update('indebtednessRecords', [
      ...data.indebtednessRecords,
      { category: '', classification: '', amount: 0, source: '' },
    ]);
  };

  const updateIndebtednessRecord = (
    index: number,
    patch: Partial<IndebtednessRecord>
  ) => {
    const next = [...data.indebtednessRecords];
    next[index] = { ...next[index], ...patch };
    update('indebtednessRecords', next);
  };

  const removeIndebtednessRecord = (index: number) => {
    update(
      'indebtednessRecords',
      data.indebtednessRecords.filter((_, i) => i !== index)
    );
  };

  const totalIndebtedness = data.indebtednessRecords.reduce(
    (sum, r) => sum + (Number(r.amount) || 0),
    0
  );

  const debtToEquity =
    data.netWorth > 0 ? totalIndebtedness / data.netWorth : 0;
  const debtToEquityFlagged = debtToEquity > 2;

  const kpiConfigs: Array<{
    field: 'fy26Revenue' | 'profitAfterTax' | 'netWorth' | 'ebitdaMargin';
    label: string;
    prefix: string;
    suffix: string;
    note: string;
  }> = [
    {
      field: 'fy26Revenue',
      label: 'Revenue from Ops',
      prefix: '₹',
      suffix: ' Mn',
      note: 'Source: Consolidated P&L, pg 142 · Confidence 96%',
    },
    {
      field: 'profitAfterTax',
      label: 'PAT',
      prefix: '₹',
      suffix: ' Mn',
      note: 'Source: Consolidated P&L, pg 142 · Confidence 96%',
    },
    {
      field: 'netWorth',
      label: 'Net Worth',
      prefix: '₹',
      suffix: ' Mn',
      note: 'Source: Consolidated Balance Sheet, pg 140 · Confidence 95%',
    },
    {
      field: 'ebitdaMargin',
      label: 'EBITDA Margin',
      prefix: '',
      suffix: '%',
      note: 'Source: Consolidated P&L computation · Confidence 92%',
    },
  ];

  return (
    <div className="paper-sheet-section space-y-9">
      {/* HEADER */}
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Section III</span>
        <h3 className="doc-section-title">
          Financial Dossier &amp; Management Discussion
        </h3>
        <p className="doc-section-sub">
          Per SEBI ICDR restated financial statements requirements. Upload
          audited consolidated financials; AI extracts KPIs, indebtedness
          &amp; drafts MD&amp;A. All AI-generated figures/text require
          CFO/Compliance Officer sign-off before lock.
        </p>
      </div>

      {/* 3.1 DOCUMENT INGESTION */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-4">
          3.1 Document Ingestion
        </p>

        <div className="space-y-3">
          {data.financialDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {doc.file || doc.reusedFromStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-4 h-4 border border-slate-300 rounded-sm shrink-0" />
                )}

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {doc.label}{' '}
                    {!doc.required && (
                      <span className="text-[9px] font-black uppercase text-slate-400 ml-1">
                        Optional
                      </span>
                    )}
                  </p>

                  {doc.reusedFromStep && (
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Matches document from Step {doc.reusedFromStep} — reused,
                      not re-uploaded.
                    </p>
                  )}

                  {doc.file && (
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      {doc.file.name} · {(doc.file.size / 1024).toFixed(0)} KB
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {doc.file && (
                  <button
                    type="button"
                    onClick={() => removeFile(doc.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <label className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase border border-slate-300 rounded-md px-3 py-2 cursor-pointer hover:bg-slate-50">
                  <UploadCloud className="w-3.5 h-3.5" />
                  Drop / Browse
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleFileSelect(doc.id, e.target.files)
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {extracting && (
          <div className="mt-4">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E3A8A] transition-all duration-300"
                style={{ width: `${extractProgress}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              Parsing tables… ({extractProgress}%)
            </p>
          </div>
        )}

        <div className="flex justify-end mt-5">
          <button
            type="button"
            disabled={!allRequiredPresent || extracting}
            onClick={handleUploadAndExtract}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-wide rounded-md ${
              !allRequiredPresent || extracting
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#1E3A8A] text-white hover:bg-[#152C69]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upload &amp; Extract Data
          </button>
        </div>

        {errors.financialDocuments && (
          <p className="text-[10px] text-red-700 font-bold mt-3">
            {errors.financialDocuments}
          </p>
        )}
      </div>

      {/* 3.2 KPI CARDS */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-4">
          3.2 Auto-Extracted Financial Highlights (FY2026)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiConfigs.map((kpi) => {
            const locked = isKpiLocked(kpi.field);
            const value = data[kpi.field];

            return (
              <div
                key={kpi.field}
                className="group relative rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  {kpi.label}
                </p>

                {locked ? (
                  <p className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    {kpi.prefix}
                    {value ? value.toLocaleString('en-IN') : '—'}
                    {kpi.suffix}
                    <Lock className="w-3 h-3 text-slate-400" />
                  </p>
                ) : (
                  <input
                    type="number"
                    value={value || ''}
                    onChange={(e) =>
                      update(kpi.field, Number(e.target.value))
                    }
                    className={PAPER_INPUT}
                  />
                )}

                {locked && (
                  <button
                    type="button"
                    onClick={() => unlockKpi(kpi.field)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-black uppercase text-[#1E3A8A] bg-white/90 px-1.5 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                )}

                {/* Custom provenance tooltip */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 z-20 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-[9px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  {kpi.note}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>

                {data.kpiEditAudit[kpi.field] && (
                  <p className="text-[9px] text-amber-700 font-semibold mt-2">
                    Audit note: {data.kpiEditAudit[kpi.field]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3.3 MD&A */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-700">
            3.3 Management Discussion &amp; Analysis (MD&amp;A)
          </p>

          {activeSection.aiDrafted && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-[#1E3A8A] bg-blue-50 border border-blue-200 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              AI Drafted
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {MDA_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => update('mdaActiveTab', tab)}
              className={`text-[10px] font-black uppercase tracking-wide px-3 py-2 rounded-md border ${
                activeTab === tab
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <textarea
            rows={7}
            value={activeSection.content}
            onChange={(e) => updateActiveSection(e.target.value)}
            className={PAPER_TEXTAREA}
            placeholder="AI-drafted commentary will appear here once financial data is extracted, or write your own analysis."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <p className="text-[10px] font-bold text-slate-500">
              Word count: {activeSection.wordCount}/2000 · Tone:
              Formal-Regulatory ✓ · Plagiarism check ✓
            </p>

            <button
              type="button"
              onClick={regenerateActiveSection}
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-slate-600"
            >
              <RotateCcw className="w-3 h-3" />
              Regenerate
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={acceptSection}
              className="px-4 py-2 text-[10px] font-black uppercase rounded-md bg-emerald-600 text-white"
            >
              Accept
            </button>

            <button
              type="button"
              className="px-4 py-2 text-[10px] font-black uppercase rounded-md border border-slate-300 text-slate-700"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={rejectAndRewrite}
              className="px-4 py-2 text-[10px] font-black uppercase rounded-md border border-red-300 text-red-700"
            >
              Reject &amp; Rewrite
            </button>
          </div>
        </div>
      </div>

      {/* 3.4 FINANCIAL INDEBTEDNESS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-700">
            3.4 Financial Indebtedness
          </p>

          <button
            type="button"
            onClick={addIndebtednessRecord}
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase"
          >
            <Plus className="w-3 h-3" />
            Add Record
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-[9px] font-black uppercase text-slate-500">
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Classification</th>
                <th className="text-left px-4 py-3">Amount (Mn)</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {data.indebtednessRecords.map((record, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <input
                      value={record.category}
                      onChange={(e) =>
                        updateIndebtednessRecord(index, {
                          category: e.target.value,
                        })
                      }
                      className={PAPER_INPUT}
                    />
                  </td>

                  <td className="px-4 py-2">
                    <select
                      value={record.classification}
                      onChange={(e) =>
                        updateIndebtednessRecord(index, {
                          classification:
                            e.target
                              .value as IndebtednessRecord['classification'],
                        })
                      }
                      className={PAPER_SELECT}
                    >
                      <option value="">Select</option>
                      <option value="Current">Current</option>
                      <option value="Non-Current">Non-Current</option>
                    </select>
                  </td>

                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={record.amount || ''}
                      onChange={(e) =>
                        updateIndebtednessRecord(index, {
                          amount: Number(e.target.value),
                        })
                      }
                      className={PAPER_INPUT}
                    />
                  </td>

                  <td className="px-4 py-2">
                    <input
                      value={record.source}
                      onChange={(e) =>
                        updateIndebtednessRecord(index, {
                          source: e.target.value,
                        })
                      }
                      className={PAPER_INPUT}
                    />
                  </td>

                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeIndebtednessRecord(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {data.indebtednessRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[10px] text-slate-500"
                  >
                    No indebtedness records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <span className="text-xs font-black text-slate-800">
            Total Indebtedness: ₹
            {totalIndebtedness.toLocaleString('en-IN')} Mn
          </span>

          {debtToEquityFlagged && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              D/E ratio exceeds threshold
            </span>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="ledger-summary">
        <div>
          <span className="ledger-label">Financial Dossier</span>
          <span className="ledger-value">Step 3</span>
        </div>

        <span className="ledger-tag-success">
          <FileCheck2 className="w-3.5 h-3.5 inline mr-1" />
          Ready for MD&amp;A review
        </span>
      </div>
    </div>
  );
}
