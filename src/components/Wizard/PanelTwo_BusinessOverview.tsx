// 'use client';

// import { Plus, Trash2, AlertTriangle } from 'lucide-react';
// import HighlighterField from '../ui/HighlighterField';
// import InkCheckbox from '../ui/InkCheckbox';
// import { WizardFormData, ProductItem, PAPER_INPUT, PAPER_SELECT, PAPER_TEXTAREA } from './wizardTypes';

// interface PanelProps {
//   data: WizardFormData;
//   update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
//   errors: Record<string, string>;
// }

// const SECTORS = [
//   'Railways & Metro Rail', 'Renewable Energy (Solar, Wind)', 'Power Generation & Distribution',
//   'Industrial Manufacturing', 'Infrastructure & Construction', 'Oil & Gas', 'Defense', 'Government/PSUs',
// ];

// export default function PanelTwo_BusinessOverview({ data, update }: PanelProps) {
//   const hasPromoPhrases = /best in class|leading player|world class|finest/gi.test(data.businessModel);

//   const addProduct = () => {
//     if (data.products.length >= 10) return;
//     update('products', [...data.products, { name: '', description: '', revenueContribution: 0, category: 'Manufactured Product' }]);
//   };

//   const removeProduct = (idx: number) => {
//     if (data.products.length <= 2) return;
//     update('products', data.products.filter((_, i) => i !== idx));
//   };

//   const updateProduct = (idx: number, field: keyof ProductItem, value: any) => {
//     const updated = [...data.products];
//     updated[idx] = { ...updated[idx], [field]: field === 'revenueContribution' ? parseInt(value) || 0 : value };
//     update('products', updated);
//   };

//   const toggleSector = (sector: string) => {
//     const isChecked = data.sectorsServed.includes(sector);
//     const breakdowns = { ...data.sectorBreakdowns };
//     let sectors = [...data.sectorsServed];
//     if (isChecked) {
//       sectors = sectors.filter((s) => s !== sector);
//       delete breakdowns[sector];
//     } else {
//       sectors.push(sector);
//       breakdowns[sector] = { revenue: 0, customers: '' };
//     }
//     update('sectorsServed', sectors);
//     update('sectorBreakdowns', breakdowns);
//   };

//   const updateBreakdown = (sector: string, field: 'revenue' | 'customers', value: any) => {
//     const breakdowns = { ...data.sectorBreakdowns };
//     breakdowns[sector] = {
//       ...breakdowns[sector],
//       [field]: field === 'revenue' ? parseInt(value) || 0 : value,
//     };
//     update('sectorBreakdowns', breakdowns);
//   };

//   const totalSectorRevenue = Object.values(data.sectorBreakdowns).reduce((acc, sb) => acc + sb.revenue, 0);

//   return (
//     <div className="paper-sheet-section space-y-9">
//       <div className="doc-section-header">
//         <span className="doc-section-eyebrow">Section II</span>
//         <h3 className="doc-section-title">Business &amp; Operations Overview</h3>
//         <p className="doc-section-sub">
//           Describe what the company does, its products or services, and its operational footprint. This becomes
//           the core business description in the prospectus.
//         </p>
//       </div>

//       <HighlighterField
//         label="Q2.1 — Primary Business Model Description"
//         required
//         trailing={
//           <span className={`ink-counter ${data.businessModel.length < 300 || data.businessModel.length > 800 ? 'ink-counter-warn' : ''}`}>
//             {data.businessModel.length} / 800
//           </span>
//         }
//       >
//         <textarea
//           rows={5}
//           value={data.businessModel}
//           onChange={(e) => update('businessModel', e.target.value)}
//           placeholder="We are engaged in the business of designing, manufacturing…"
//           className={PAPER_TEXTAREA}
//         />
//         {hasPromoPhrases && (
//           <p className="text-[10px] text-amber-800 font-bold flex items-center gap-1.5 bg-amber-100/70 border border-amber-300 p-2.5 rounded-md mt-2">
//             <AlertTriangle className="w-4 h-4 shrink-0" />
//             <span>Avoid promotional phrases like &apos;best in class&apos; or &apos;leading player&apos;. Keep to factual description.</span>
//           </p>
//         )}
//       </HighlighterField>

//       <HighlighterField label="Q2.1a — Unique Selling Proposition (USP)" required>
//         <textarea rows={2} value={data.usp} onChange={(e) => update('usp', e.target.value)} className={PAPER_TEXTAREA} placeholder="What differentiates the company from competitors…" />
//       </HighlighterField>

//       {/* Products */}
//       <div className="space-y-5">
//         <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
//           Q2.2 — Core Products / Services Offered (Min 2, Max 10) <span className="text-red-600">*</span>
//         </label>
//         <div className="space-y-4">
//           {data.products.map((product, idx) => (
//             <div key={idx} className="promoter-card">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="promoter-tag">Product / Service #{idx + 1}</span>
//                 {data.products.length > 2 && (
//                   <button type="button" onClick={() => removeProduct(idx)} className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 cursor-pointer">
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//               <div className="doc-cell-grid-4">
//                 <HighlighterField label="Product Name" required>
//                   <input type="text" value={product.name} onChange={(e) => updateProduct(idx, 'name', e.target.value)} placeholder="e.g. Oil-Filled Transformers" className={PAPER_INPUT} />
//                 </HighlighterField>
//                 <HighlighterField label="Category" required>
//                   <select value={product.category} onChange={(e) => updateProduct(idx, 'category', e.target.value)} className={PAPER_SELECT}>
//                     <option value="Manufactured Product">Manufactured Product</option>
//                     <option value="Traded Product">Traded Product</option>
//                     <option value="Service Offering">Service Offering</option>
//                     <option value="Software/Digital Product">Software/Digital Product</option>
//                     <option value="Hybrid (Product + Service)">Hybrid (Product + Service)</option>
//                   </select>
//                 </HighlighterField>
//                 <HighlighterField label="Revenue Contribution (%)" required>
//                   <input type="number" value={product.revenueContribution || ''} onChange={(e) => updateProduct(idx, 'revenueContribution', e.target.value)} placeholder="0-100%" className={PAPER_INPUT} />
//                 </HighlighterField>
//                 <HighlighterField label="Description (100-300 chars)" required>
//                   <textarea rows={2} value={product.description} onChange={(e) => updateProduct(idx, 'description', e.target.value)} placeholder="Technical features, specifications…" className={`${PAPER_TEXTAREA} text-[11px]`} />
//                 </HighlighterField>
//               </div>
//             </div>
//           ))}
//         </div>
//         <button
//           type="button"
//           onClick={addProduct}
//           disabled={data.products.length >= 10}
//           className={`push-tab-outline px-4 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 ${data.products.length >= 10 ? 'opacity-40 cursor-not-allowed' : ''}`}
//         >
//           <Plus className="w-4 h-4" /> Add Product
//         </button>
//       </div>

//       {/* Sectors served */}
//       <div className="space-y-3.5">
//         <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
//           Q2.3 — Industries / Sectors Served <span className="text-red-600">*</span>
//         </label>
//         <div className="checklist-panel grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {SECTORS.map((sector) => (
//             <InkCheckbox key={sector} checked={data.sectorsServed.includes(sector)} onChange={() => toggleSector(sector)} label={sector} />
//           ))}
//         </div>
//       </div>

//       {/* Sector revenue breakdown */}
//       <div className="space-y-4">
//         <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
//           Q2.4 — Detailed Sector-wise Revenue Breakdown <span className="text-red-600">*</span>
//         </label>
//         {data.sectorsServed.length === 0 ? (
//           <div className="ledger-empty">Select at least one sector in Q2.3 to populate the breakdown ledger.</div>
//         ) : (
//           <div className="ledger-table-wrap">
//             <table className="ledger-table">
//               <thead>
//                 <tr>
//                   <th>Sector / Industry</th>
//                   <th>Revenue (₹ Lakhs)</th>
//                   <th>% of Total</th>
//                   <th>Key Customers</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.sectorsServed.map((sector) => {
//                   const cell = data.sectorBreakdowns[sector] || { revenue: 0, customers: '' };
//                   const share = totalSectorRevenue > 0 ? ((cell.revenue / totalSectorRevenue) * 100).toFixed(1) : '0.0';
//                   return (
//                     <tr key={sector}>
//                       <td className="font-bold text-slate-800">{sector}</td>
//                       <td>
//                         <input type="number" value={cell.revenue || ''} onChange={(e) => updateBreakdown(sector, 'revenue', e.target.value)} placeholder="₹ Lakhs" className="ledger-cell-input" />
//                       </td>
//                       <td className="font-bold text-primary">{share}%</td>
//                       <td>
//                         <input type="text" value={cell.customers} onChange={(e) => updateBreakdown(sector, 'customers', e.target.value)} placeholder="Key customer titles…" className="ledger-cell-input" />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Capacity */}
//       <div className="doc-cell-grid">
//         <HighlighterField label="Q2.5 — Installed Capacity" required>
//           <div className="flex gap-2">
//             <input type="number" value={data.capacityValue || ''} onChange={(e) => update('capacityValue', parseInt(e.target.value) || 0)} placeholder="Installed capacity value" className={PAPER_INPUT} />
//             <select value={data.capacityUnit} onChange={(e) => update('capacityUnit', e.target.value)} className={`${PAPER_SELECT} w-48 shrink-0`}>
//               <option value="MVA per annum">MVA per annum</option>
//               <option value="Units per month">Units per month</option>
//               <option value="Tonnes per annum">Tonnes per annum</option>
//               <option value="Square feet">Square feet</option>
//             </select>
//           </div>
//         </HighlighterField>
//         <HighlighterField
//           label="Q2.6 — Current Capacity Utilization"
//           required
//           trailing={<span className="ink-counter">{data.capacityUtilization}%</span>}
//         >
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={data.capacityUtilization}
//             onChange={(e) => update('capacityUtilization', parseInt(e.target.value) || 0)}
//             className="w-full h-1.5 rounded-lg bg-slate-200 accent-primary appearance-none cursor-pointer mt-3"
//           />
//         </HighlighterField>
//       </div>
//     </div>
//   );
// }

'use client';

import { useMemo, useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Lock,
  IndianRupee,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  Landmark,
  Users,
  FolderOpen,
  CalendarDays,
  History,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import HighlighterField from '../UI/HighlighterField';
import FileUploadBox, { UploadedFileMeta as UIFileMeta } from '../UI/FileUploadBox';

import {
  WizardFormData,
  SellingShareholder,
  CapitalHistoryRecord,
  PAPER_INPUT,
  PAPER_SELECT,
  PAPER_TEXTAREA,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

const FACE_VALUE_OPTIONS = [1, 2, 5, 10];

const OFS_CATEGORY_OPTIONS: SellingShareholder['category'][] = [
  'Promoter',
  'Promoter Group',
  'Public (FPI)',
  'Public (DII)',
  'Public (Other)',
];

const CONSIDERATION_OPTIONS: CapitalHistoryRecord['considerationType'][] = ['Cash', 'Bonus', 'Other'];

interface ObjectBadgeDef {
  key: string;
  label: string;
  hasAmount: boolean;
}

const OBJECTS_BADGES: ObjectBadgeDef[] = [
  { key: 'Debt Repayment', label: 'Debt Repayment', hasAmount: true },
  { key: 'Capex / Expansion', label: 'Capex / Expansion', hasAmount: true },
  { key: 'Working Capital', label: 'Working Capital', hasAmount: true },
  { key: 'General Corporate', label: 'General Corporate', hasAmount: false },
];

function buildBoilerplate(key: string, amountInMillion: number): string {
  const amountStr = amountInMillion > 0 ? `₹ ${amountInMillion.toLocaleString('en-IN')} million` : '₹ [●] million';
  switch (key) {
    case 'Debt Repayment':
      return `The Company proposes to utilise an estimated amount of ${amountStr} from the Net Proceeds towards full or partial prepayment or repayment of certain outstanding borrowings availed by our Company, together with any prepayment penalties and accrued interest thereon.`;
    case 'Capex / Expansion':
      return `The Company proposes to utilise an estimated amount of ${amountStr} from the Net Proceeds towards funding capital expenditure requirements for expansion and modernisation of its manufacturing/operational facilities.`;
    case 'Working Capital':
      return `The Company proposes to utilise an estimated amount of ${amountStr} from the Net Proceeds towards funding incremental working capital requirements of the Company.`;
    case 'General Corporate':
      return `The balance of the Net Proceeds, after meeting the objects set out above, shall be utilised towards general corporate purposes, in compliance with the applicable provisions of the SEBI ICDR Regulations.`;
    default:
      return '';
  }
}

const toFileMeta = (file: File): UIFileMeta => ({
  name: file.name,
  size: file.size,
  uploadedAt: new Date().toISOString(),
});

/** Shared grid templates — used identically for header row and data rows so columns can never drift out of alignment. */
const CAP_HISTORY_GRID = '78px 1.3fr 1.2fr 0.9fr 1fr 1fr 1.4fr 36px';
const OFS_GRID = '1.7fr 1.1fr 1.1fr 1.1fr 36px';

const gridInputClass = (locked?: boolean) =>
  `w-full px-2 py-1.5 text-xs font-bold rounded-md border focus:outline-none transition-colors placeholder:font-semibold placeholder:text-slate-350 ${
    locked
      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-800 cursor-not-allowed'
      : 'bg-[#fffdf8] border-slate-300 text-slate-800 focus:border-primary'
  }`;

/** Small red-asterisk label used above grid table columns, matching HighlighterField's "required" styling. */
function RequiredColHeader({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <span className={`text-[9px] font-black uppercase tracking-wider text-slate-500 ${alignClass}`}>
      {children} <span className="text-red-600">*</span>
    </span>
  );
}

function isCapitalRowComplete(r: CapitalHistoryRecord): boolean {
  return Boolean(r.date) && r.sharesAllotted > 0 && r.faceValue > 0 && r.issuePrice > 0 && Boolean(r.considerationType);
}

function isCapitalRowBlank(r: CapitalHistoryRecord): boolean {
  return !r.date && !r.sharesAllotted && !r.issuePrice && !r.considerationType;
}

export default function PanelTwo_BusinessOverview({ data, update, errors }: PanelProps) {
  const [isProcessingIpoDoc, setIsProcessingIpoDoc] = useState(false);
  const [isProcessingCapDocs, setIsProcessingCapDocs] = useState(false);

  const capitalHistoryRecords = data.capitalHistoryRecords ?? [];
  const sellingShareholders = data.sellingShareholders ?? [];
  const objectsOfOfferCategories = data.objectsOfOfferCategories ?? [];
  const objectsOfOfferAmounts = data.objectsOfOfferAmounts ?? {};

  const isOfsVisible =
    data.offerStructure === 'Offer for Sale (OFS) Only' ||
    data.offerStructure === 'Fresh Issue + Offer for Sale (OFS)';

  const isFreshIssueVisible =
    data.offerStructure === 'Fresh Issue Only' ||
    data.offerStructure === 'Fresh Issue + Offer for Sale (OFS)';

  const proposedFreshIssueSize = useMemo(
    () => (data.proposedShares || 0) * (data.capPrice || 0),
    [data.proposedShares, data.capPrice]
  );

  useEffect(() => {
    if (data.issueSize !== proposedFreshIssueSize) {
      update('issueSize', proposedFreshIssueSize);
      update('totalIssueSize', proposedFreshIssueSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposedFreshIssueSize]);

  const totalOfsSharesOffered = useMemo(
    () => sellingShareholders.reduce((acc, s) => acc + (s.sharesOffered || 0), 0),
    [sellingShareholders]
  );

  const promoterOfsShares = useMemo(
    () =>
      sellingShareholders
        .filter((s) => s.category === 'Promoter' || s.category === 'Promoter Group')
        .reduce((acc, s) => acc + (s.sharesOffered || 0), 0),
    [sellingShareholders]
  );

  const postIssuePromoterPct = useMemo(() => {
    const denominator = (data.preIssueTotalShares || 0) + (data.proposedShares || 0);
    if (!denominator) return 0;
    const numerator = (data.preIssuePromoterShares || 0) - promoterOfsShares;
    return (numerator / denominator) * 100;
  }, [data.preIssueTotalShares, data.proposedShares, data.preIssuePromoterShares, promoterOfsShares]);

  const mpcMet = postIssuePromoterPct >= 20;
  const promoterPct = data.promoterShareholdingPercentage || 0;

  /* ---------------- 2.1a — IPO Authorization upload ---------------- */
  const handleIpoDocSelected = (file: File) => {
    update('ipoAuthorizationDoc', toFileMeta(file));
    setIsProcessingIpoDoc(true);
    setTimeout(() => {
      update('egmAgmDate', '2023-06-15');
      update('maxAuthorizedIssueLimit', 75000000000);
      setIsProcessingIpoDoc(false);
    }, 1500);
  };

  const handleIpoDocRemove = () => {
    update('ipoAuthorizationDoc', null);
    update('egmAgmDate', '');
    update('maxAuthorizedIssueLimit', 0);
  };

  /* ---------------- 2.1b — Capital History uploads ---------------- */
  const runCapitalHistoryExtraction = () => {
    setIsProcessingCapDocs(true);
    setTimeout(() => {
      update('capitalHistoryRecords', [
        { date: '2007-06-15', sharesAllotted: 500000, faceValue: 10, issuePrice: 10, considerationType: 'Cash', isAiExtracted: true },
        { date: '2015-03-20', sharesAllotted: 2000000000, faceValue: 10, issuePrice: 10, considerationType: 'Bonus', isAiExtracted: true },
        { date: '2020-11-05', sharesAllotted: 6938530830, faceValue: 10, issuePrice: 10, considerationType: 'Cash', isAiExtracted: true },
      ]);
      setIsProcessingCapDocs(false);
    }, 1500);
  };

  const handleCapDoc1Selected = (file: File) => {
    update('capitalStructureDoc1', toFileMeta(file));
    if (data.capitalStructureDoc2) runCapitalHistoryExtraction();
  };

  const handleCapDoc2Selected = (file: File) => {
    update('capitalStructureDoc2', toFileMeta(file));
    if (data.capitalStructureDoc1) runCapitalHistoryExtraction();
  };

  const addCapitalHistoryRow = () => {
    update('capitalHistoryRecords', [
      ...capitalHistoryRecords,
      { date: '', sharesAllotted: 0, faceValue: 10, issuePrice: 0, considerationType: '', isAiExtracted: false },
    ]);
  };

  const removeCapitalHistoryRow = (index: number) => {
    update('capitalHistoryRecords', capitalHistoryRecords.filter((_, i) => i !== index));
  };

  const updateCapitalHistoryRow = (
    index: number,
    field: keyof CapitalHistoryRecord,
    value: string | number
  ) => {
    const next = [...capitalHistoryRecords];
    next[index] = { ...next[index], [field]: value } as CapitalHistoryRecord;
    update('capitalHistoryRecords', next);
  };

  const capitalHistoryRows = useMemo(() => {
    let running = 0;
    return capitalHistoryRecords.map((r) => {
      running += (r.sharesAllotted || 0) * (r.faceValue || 0);
      return { record: r, cumulative: running };
    });
  }, [capitalHistoryRecords]);

  const finalCumulativeCapital = capitalHistoryRows.length > 0
    ? capitalHistoryRows[capitalHistoryRows.length - 1].cumulative
    : 0;

  const capitalReconciles = data.paidUpCapital > 0 && finalCumulativeCapital === data.paidUpCapital;
  const incompleteRowCount = capitalHistoryRecords.filter((r) => !r.isAiExtracted && !isCapitalRowComplete(r)).length;

  /* ---------------- 2.3 — OFS helpers ---------------- */
  const addSellingShareholder = () => {
    update('sellingShareholders', [
      ...sellingShareholders,
      { name: '', category: 'Promoter', preIssueShares: 0, sharesOffered: 0 },
    ]);
  };

  const removeSellingShareholder = (index: number) => {
    update('sellingShareholders', sellingShareholders.filter((_, i) => i !== index));
  };

  const updateSellingShareholder = (
    index: number,
    field: keyof SellingShareholder,
    value: string | number
  ) => {
    const next = [...sellingShareholders];
    next[index] = { ...next[index], [field]: value } as SellingShareholder;
    update('sellingShareholders', next);
  };

  /* ---------------- 2.4 — Objects of offer: instant AI narrative generation ---------------- */
  const generatedNarrative = useMemo(() => {
    return objectsOfOfferCategories
      .map((key) => buildBoilerplate(key, objectsOfOfferAmounts[key] ?? 0))
      .join('\n\n');
  }, [objectsOfOfferCategories, objectsOfOfferAmounts]);

  useEffect(() => {
    if (generatedNarrative && generatedNarrative !== data.objectsOfOffer) {
      update('objectsOfOffer', generatedNarrative);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedNarrative]);

  const toggleObjectBadge = (badgeKey: string) => {
    const active = objectsOfOfferCategories.includes(badgeKey);
    const next = active
      ? objectsOfOfferCategories.filter((c) => c !== badgeKey)
      : [...objectsOfOfferCategories, badgeKey];
    update('objectsOfOfferCategories', next);
  };

  const updateObjectAmount = (badgeKey: string, amount: number) => {
    update('objectsOfOfferAmounts', { ...objectsOfOfferAmounts, [badgeKey]: amount });
  };

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Step 2</span>
        <h3 className="doc-section-title">Offer Details &amp; Capital Structure</h3>
        <p className="doc-section-sub">
          Let&apos;s define the size of your offering. Core capital data has been inherited from your Step 1
          documents — upload the IPO authorization resolution and capital history records to auto-fill the rest.
        </p>
      </div>

      {/* ============ AUTO-EXTRACTED BANNER ============ */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              🔒 Auto-Extracted Capital Structure
            </p>
            <p className="text-[10px] font-semibold text-slate-500 mt-1">
              Inherited from MoA &amp; JIO shareholding-pattern documents uploaded in Step 1.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-1 shrink-0">
            <Lock className="w-3 h-3" /> Source Verified
          </span>
        </div>

        <div className="doc-cell-grid">
          <HighlighterField
            label="Authorised Capital"
            hint="Clause V — Memorandum of Association"
            trailing={<Lock className="w-3.5 h-3.5 text-emerald-600" />}
          >
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="number"
                value={data.authorisedCapital || ''}
                onChange={(e) => update('authorisedCapital', Number(e.target.value))}
                className={`${PAPER_INPUT} pl-7`}
              />
            </div>
          </HighlighterField>

          <HighlighterField
            label="Paid-Up Capital"
            hint="JIO shareholding-pattern — Table I"
            error={
              data.paidUpCapital > data.authorisedCapital
                ? 'Paid-up capital cannot exceed authorised capital.'
                : null
            }
          >
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="number"
                value={data.paidUpCapital || ''}
                onChange={(e) => update('paidUpCapital', Number(e.target.value))}
                className={`${PAPER_INPUT} pl-7`}
              />
            </div>
          </HighlighterField>

          <HighlighterField
            label="Promoter Holding (%)"
            hint="JIO shareholding-pattern — Table II"
            trailing={
              <span
                className={`text-[9px] font-black uppercase rounded-full px-2 py-0.5 ${
                  promoterPct >= 20
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {promoterPct >= 20 ? '✓ MPC MET' : 'Below 20%'}
              </span>
            }
          >
            <input
              type="number"
              step="0.01"
              value={data.promoterShareholdingPercentage || ''}
              onChange={(e) => update('promoterShareholdingPercentage', Number(e.target.value))}
              className={PAPER_INPUT}
            />
          </HighlighterField>

          <HighlighterField label="FII / FPI Holding (%)" hint="Summary Statement — Institutional Float">
            <input
              type="number"
              step="0.01"
              value={data.fiiShareholdingPercentage || ''}
              onChange={(e) => update('fiiShareholdingPercentage', Number(e.target.value))}
              className={PAPER_INPUT}
            />
          </HighlighterField>
        </div>
      </div>

      {/* ============ 2.1 — SUPPORTING DOCUMENT UPLOADS ============ */}
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" /> 2.1 — Capital Structure Supporting Documents
          </h4>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">
            Upload the legal resolution and historical allotment records to auto-fill offer authorization limits
            and the equity capital history table.
          </p>
        </div>

        {/* 2.1a IPO Authorization */}
        <div className="promoter-card space-y-3">
          <span className="promoter-tag">IPO Authorization Resolution</span>
          <p className="text-[10px] font-semibold text-slate-500">
            Exact file: <span className="font-bold text-slate-700">&quot;STATEMENT PURSUANT TO SECTION 102(1) OF THE COMPANIES ACT, 2013&quot;.pdf</span>
          </p>

          <FileUploadBox
            expectedFileName="legal STATEMENT PURSUANT..."
            helperText="AI extracts the EGM/AGM Resolution Date and Maximum Authorized Issue Size automatically."
            file={data.ipoAuthorizationDoc}
            isProcessing={isProcessingIpoDoc}
            onFileSelected={handleIpoDocSelected}
            onRemove={handleIpoDocRemove}
          />

          <div className="doc-cell-grid">
            <HighlighterField label="EGM / AGM Resolution Date" hint="AI auto-fills once document is processed">
              <div className="relative">
                <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={data.egmAgmDate}
                  onChange={(e) => update('egmAgmDate', e.target.value)}
                  className={`${PAPER_INPUT} pl-7`}
                />
              </div>
            </HighlighterField>

            <HighlighterField label="Max Authorized Issue Limit (₹)" hint="AI auto-fills once document is processed">
              <div className="relative">
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number"
                  value={data.maxAuthorizedIssueLimit || ''}
                  onChange={(e) => update('maxAuthorizedIssueLimit', Number(e.target.value))}
                  className={`${PAPER_INPUT} pl-7`}
                />
              </div>
            </HighlighterField>
          </div>

          {data.maxAuthorizedIssueLimit > 0 &&
            proposedFreshIssueSize > data.maxAuthorizedIssueLimit && (
              <p className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5">
                ⚠ Proposed Fresh Issue Size exceeds the shareholder-authorized limit.
              </p>
            )}
        </div>

        {/* 2.1b Capital History Build-up — CSS Grid table, boxed */}
        <div className="promoter-card space-y-3">
          <span className="promoter-tag flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Capital History Build-up
          </span>
          <p className="text-[10px] font-semibold text-slate-500">
            Both files are required to auto-build the historical &quot;History of Equity Share Capital&quot; table.
          </p>

          <div className="doc-cell-grid">
            <FileUploadBox
              expectedFileName="Capital Structure & Our Promoters.pdf"
              helperText="Historical allotment records — dates, shares, face value, issue price."
              file={data.capitalStructureDoc1}
              isProcessing={isProcessingCapDocs}
              onFileSelected={handleCapDoc1Selected}
              onRemove={() => update('capitalStructureDoc1', null)}
            />
            <FileUploadBox
              expectedFileName="CAPITAL STRUCTURE and promotors share holding.pdf"
              helperText="Cross-verifies allotment history against promoter shareholding records."
              file={data.capitalStructureDoc2}
              isProcessing={isProcessingCapDocs}
              onFileSelected={handleCapDoc2Selected}
              onRemove={() => update('capitalStructureDoc2', null)}
            />
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                History of Equity Share Capital
              </span>
              <button
                type="button"
                onClick={addCapitalHistoryRow}
                className="push-tab-outline px-3 py-1.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Allotment
              </button>
            </div>

            {/* Boxed table container — light border, rounded corners */}
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
              {/* Header row — identical gridTemplateColumns as data rows */}
              <div
                className="grid items-center gap-3 px-3 py-2.5 bg-slate-50 border-b-2 border-slate-200"
                style={{ gridTemplateColumns: CAP_HISTORY_GRID }}
              >
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 text-center">Source</span>
                <RequiredColHeader>Date of Allotment</RequiredColHeader>
                <RequiredColHeader>Shares Allotted</RequiredColHeader>
                <RequiredColHeader align="center">Face Value (₹)</RequiredColHeader>
                <RequiredColHeader>Issue Price (₹)</RequiredColHeader>
                <RequiredColHeader>Consideration</RequiredColHeader>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 text-right">Cumulative Paid-Up Capital</span>
                <span />
              </div>

              {capitalHistoryRows.length === 0 ? (
                <div className="px-4 py-6 text-center text-[10px] font-semibold text-slate-400">
                  No allotment records yet. Upload both documents above, or add a row manually.
                </div>
              ) : (
                capitalHistoryRows.map(({ record, cumulative }, index) => {
                  const complete = isCapitalRowComplete(record);
                  const blank = isCapitalRowBlank(record);
                  return (
                    <div
                      key={index}
                      className={`grid items-center gap-3 px-3 py-2.5 ${
                        record.isAiExtracted
                          ? 'bg-emerald-50/60'
                          : blank
                          ? 'bg-amber-50/50 hover:bg-amber-50'
                          : 'bg-white hover:bg-slate-50/60'
                      }`}
                      style={{ gridTemplateColumns: CAP_HISTORY_GRID }}
                    >
                      <div className="flex justify-center">
                        {record.isAiExtracted ? (
                          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full px-1.5 py-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> AI
                          </span>
                        ) : blank ? (
                          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-300 rounded-full px-1.5 py-0.5">
                            <AlertCircle className="w-2.5 h-2.5" /> Empty
                          </span>
                        ) : complete ? (
                          <span className="text-[8px] font-black uppercase text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-1.5 py-0.5">
                            Manual
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-300 rounded-full px-1.5 py-0.5">
                            Incomplete
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        <input
                          type="date"
                          value={record.date}
                          disabled={record.isAiExtracted}
                          onChange={(e) => updateCapitalHistoryRow(index, 'date', e.target.value)}
                          className={`${gridInputClass(record.isAiExtracted)} pl-6`}
                        />
                      </div>

                      <input
                        type="number"
                        value={record.sharesAllotted || ''}
                        disabled={record.isAiExtracted}
                        onChange={(e) => updateCapitalHistoryRow(index, 'sharesAllotted', Number(e.target.value))}
                        placeholder="e.g. 500,000"
                        className={gridInputClass(record.isAiExtracted)}
                      />

                      {record.isAiExtracted ? (
                        <div className="px-2 py-1.5 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md text-center">
                          ₹{record.faceValue}
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={record.faceValue || ''}
                          onChange={(e) => updateCapitalHistoryRow(index, 'faceValue', Number(e.target.value))}
                          placeholder="10"
                          className={`${gridInputClass(false)} text-center`}
                        />
                      )}

                      <input
                        type="number"
                        step="0.01"
                        value={record.issuePrice || ''}
                        disabled={record.isAiExtracted}
                        onChange={(e) => updateCapitalHistoryRow(index, 'issuePrice', Number(e.target.value))}
                        placeholder="e.g. 10.00"
                        className={gridInputClass(record.isAiExtracted)}
                      />

                      {record.isAiExtracted ? (
                        <div className="px-2 py-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md text-center truncate">
                          {record.considerationType || '—'}
                        </div>
                      ) : (
                        <select
                          value={record.considerationType}
                          onChange={(e) =>
                            updateCapitalHistoryRow(
                              index,
                              'considerationType',
                              e.target.value as CapitalHistoryRecord['considerationType']
                            )
                          }
                          className={`${gridInputClass(false)} ${record.considerationType ? '' : 'text-slate-400 font-semibold'}`}
                        >
                          <option value="">Select</option>
                          {CONSIDERATION_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      )}

                      <div className="px-2 py-1.5 text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 rounded-md text-right">
                        ₹{cumulative.toLocaleString('en-IN')}
                      </div>

                      <div className="flex items-center justify-center h-full">
                        <button
                          type="button"
                          onClick={() => removeCapitalHistoryRow(index)}
                          disabled={record.isAiExtracted}
                          className={`p-1 rounded-md ${
                            record.isAiExtracted
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {incompleteRowCount > 0 && (
              <p className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {incompleteRowCount} row{incompleteRowCount > 1 ? 's' : ''} incomplete — fill in all required (*) fields or remove the row using the trash icon.
              </p>
            )}

            {capitalHistoryRows.length > 0 && (
              <div
                className={`rounded-md border px-3 py-2 flex items-center justify-between ${
                  capitalReconciles ? 'border-emerald-300 bg-emerald-50/70' : 'border-amber-300 bg-amber-50/70'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-600">
                  Cumulative Total from Allotment History: <span className="font-black text-slate-800">₹{finalCumulativeCapital.toLocaleString('en-IN')}</span>
                  {' '}vs. Step 1 Paid-Up Capital: <span className="font-black text-slate-800">₹{data.paidUpCapital.toLocaleString('en-IN')}</span>
                </span>
                <span className={`text-[9px] font-black uppercase rounded-full px-2 py-0.5 ${capitalReconciles ? 'text-emerald-700 bg-emerald-100 border border-emerald-300' : 'text-amber-700 bg-amber-100 border border-amber-300'}`}>
                  {capitalReconciles ? '✓ Reconciled' : '⚠ Mismatch'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ 2.2 — OFFER MECHANICS ============ */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" /> 2.2 — Offer Mechanics
          </h4>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">Define the offer structure and proposed issue size.</p>
        </div>

        <div className="promoter-card space-y-4">
          <div className="doc-cell-grid">
            <HighlighterField label="Offer Structure" required error={errors.offerStructure}>
              <select
                value={data.offerStructure}
                onChange={(e) => update('offerStructure', e.target.value as WizardFormData['offerStructure'])}
                className={PAPER_SELECT}
              >
                <option value="">Select offer structure</option>
                <option value="Fresh Issue Only">Fresh Issue Only</option>
                <option value="Offer for Sale (OFS) Only">Offer for Sale (OFS) Only</option>
                <option value="Fresh Issue + Offer for Sale (OFS)">Fresh Issue + Offer for Sale (OFS)</option>
              </select>
            </HighlighterField>

            <HighlighterField label="Face Value per Share (₹)" required hint="Pulled from MoA">
              <select
                value={data.faceValuePerShare || 10}
                onChange={(e) => update('faceValuePerShare', Number(e.target.value))}
                className={PAPER_SELECT}
              >
                {FACE_VALUE_OPTIONS.map((fv) => (
                  <option key={fv} value={fv}>
                    ₹{fv}
                  </option>
                ))}
              </select>
            </HighlighterField>
          </div>

          {isFreshIssueVisible && (
            <div className="doc-cell-grid-4">
              <HighlighterField label="Number of Fresh Shares" required error={errors.proposedShares}>
                <input
                  type="number"
                  placeholder="e.g. 270,000,000"
                  value={data.proposedShares || ''}
                  onChange={(e) => update('proposedShares', Number(e.target.value))}
                  className={PAPER_INPUT}
                />
              </HighlighterField>

              <HighlighterField label="Estimated Cap Price (₹)" required error={errors.capPrice}>
                <div className="relative">
                  <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={data.capPrice || ''}
                    onChange={(e) => update('capPrice', Number(e.target.value))}
                    className={`${PAPER_INPUT} pl-7`}
                  />
                </div>
              </HighlighterField>

              <div className="md:col-span-2">
                <HighlighterField label="💰 Proposed Fresh Issue Size (₹)" hint="Shares × Cap Price · auto-calculated">
                  <div className="flex items-center h-10 rounded-md border border-slate-300 bg-slate-50 px-3 font-bold text-slate-800 text-sm">
                    ₹{proposedFreshIssueSize.toLocaleString('en-IN')}
                  </div>
                </HighlighterField>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ 2.3 — OFS MATRIX (conditional) — CSS Grid table, boxed ============ */}
      {isOfsVisible && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> 2.3 — Offer for Sale (OFS) Allocation
              </h4>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">
                Populated from JIO shareholding-pattern.pdf — Table II (Promoter) and Table III (Public).
              </p>
            </div>

            <button
              type="button"
              onClick={addSellingShareholder}
              className="push-tab-outline px-3 py-1.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Shareholder
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            <div
              className="grid items-center gap-3 px-3 py-2.5 bg-slate-50 border-b-2 border-slate-200"
              style={{ gridTemplateColumns: OFS_GRID }}
            >
              <RequiredColHeader>Shareholder Name</RequiredColHeader>
              <RequiredColHeader>Category</RequiredColHeader>
              <RequiredColHeader align="right">Pre-Issue Shares</RequiredColHeader>
              <RequiredColHeader align="right">OFS Shares Offered</RequiredColHeader>
              <span />
            </div>

            {sellingShareholders.length === 0 ? (
              <div className="px-4 py-6 text-center text-[10px] font-semibold text-slate-400">
                No selling shareholders added yet. Use &quot;Add Shareholder&quot; above.
              </div>
            ) : (
              sellingShareholders.map((shareholder, index) => (
                <div
                  key={index}
                  className="grid items-center gap-3 px-3 py-2.5 bg-white hover:bg-slate-50/60"
                  style={{ gridTemplateColumns: OFS_GRID }}
                >
                  <input
                    value={shareholder.name}
                    onChange={(e) => updateSellingShareholder(index, 'name', e.target.value)}
                    placeholder="e.g. Reliance Industries Ltd"
                    className={gridInputClass(false)}
                  />

                  <select
                    value={shareholder.category}
                    onChange={(e) =>
                      updateSellingShareholder(index, 'category', e.target.value as SellingShareholder['category'])
                    }
                    className={gridInputClass(false)}
                  >
                    {OFS_CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={shareholder.preIssueShares || ''}
                    onChange={(e) => updateSellingShareholder(index, 'preIssueShares', Number(e.target.value))}
                    placeholder="e.g. 5,937,841,645"
                    className={`${gridInputClass(false)} text-right`}
                  />

                  <input
                    type="number"
                    value={shareholder.sharesOffered || ''}
                    onChange={(e) => updateSellingShareholder(index, 'sharesOffered', Number(e.target.value))}
                    placeholder="e.g. 500,000"
                    className={`${gridInputClass(false)} text-right`}
                  />

                  <div className="flex items-center justify-center h-full">
                    <button
                      type="button"
                      onClick={() => removeSellingShareholder(index)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {sellingShareholders.length > 0 && (
            <div className="ledger-summary">
              <div>
                <span className="ledger-label">Total Shares Offered in OFS</span>
                <span className="ledger-value">{totalOfsSharesOffered.toLocaleString('en-IN')}</span>
              </div>
              <span className="ledger-tag-success">OFS breakdown</span>
            </div>
          )}
        </div>
      )}

      {/* ============ 2.4 — OBJECTS OF THE OFFER (interactive AI-generation tags) ============ */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
          🎯 2.4 — Objects of the Offer
        </h4>

        <div className="flex flex-wrap gap-2">
          {OBJECTS_BADGES.map((badge) => {
            const active = objectsOfOfferCategories.includes(badge.key);
            return (
              <button
                key={badge.key}
                type="button"
                onClick={() => toggleObjectBadge(badge.key)}
                className={`text-[10px] font-black uppercase tracking-wider rounded-full px-3 py-1.5 border transition-colors ${
                  active
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {badge.label}
              </button>
            );
          })}
        </div>

        {objectsOfOfferCategories.some((key) => OBJECTS_BADGES.find((b) => b.key === key)?.hasAmount) && (
          <div className="doc-cell-grid">
            {OBJECTS_BADGES.filter((b) => b.hasAmount && objectsOfOfferCategories.includes(b.key)).map((b) => (
              <HighlighterField key={b.key} label={`${b.label} — Estimated Amount (₹ million)`}>
                <div className="relative">
                  <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="number"
                    value={objectsOfOfferAmounts[b.key] || ''}
                    onChange={(e) => updateObjectAmount(b.key, Number(e.target.value))}
                    placeholder="e.g. 15,000"
                    className={`${PAPER_INPUT} pl-7`}
                  />
                </div>
              </HighlighterField>
            ))}
          </div>
        )}

        <HighlighterField
          label="Use of Proceeds Narrative"
          required
          error={errors.objectsOfOffer}
          hint="Auto-generated from selected tags and amounts above — editable if needed."
        >
          <textarea
            rows={6}
            value={data.objectsOfOffer}
            onChange={(e) => update('objectsOfOffer', e.target.value)}
            className={PAPER_TEXTAREA}
            placeholder="Select tags above to auto-generate the standard legal narrative, or type your own."
          />
        </HighlighterField>
      </div>

      {/* ============ 2.5 — ESOP & CONVERTIBLES ============ */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            2.5 — ESOP &amp; Convertible Instruments
          </h4>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">
            Disclose any active Employee Stock Option Scheme or convertible securities.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={data.esopDetails.active}
            onChange={(e) => update('esopDetails', { ...data.esopDetails, active: e.target.checked })}
          />
          Active ESOP Scheme / Convertible Instruments Exist
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              data.esopDetails.active ? 'rotate-180' : ''
            }`}
          />
        </label>

        {data.esopDetails.active && (
          <div className="promoter-card space-y-4">
            <div className="doc-cell-grid">
              <HighlighterField label="ESOP Scheme Name" required>
                <input
                  value={data.esopDetails.schemeName}
                  onChange={(e) => update('esopDetails', { ...data.esopDetails, schemeName: e.target.value })}
                  placeholder='e.g. "Jio Platforms Limited ESOS 2020"'
                  className={PAPER_INPUT}
                />
              </HighlighterField>

              <HighlighterField label="Total Options Granted / Outstanding" required>
                <input
                  type="number"
                  value={data.esopDetails.totalOptionsGranted || ''}
                  onChange={(e) =>
                    update('esopDetails', { ...data.esopDetails, totalOptionsGranted: Number(e.target.value) })
                  }
                  className={PAPER_INPUT}
                />
              </HighlighterField>
            </div>

            <HighlighterField label="Convertible Debentures / Preference Shares" required>
              <div className="flex gap-4">
                {(['Yes', 'No'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="hasConvertibles"
                      checked={data.esopDetails.hasConvertibles === opt}
                      onChange={() => update('esopDetails', { ...data.esopDetails, hasConvertibles: opt })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </HighlighterField>
          </div>
        )}
      </div>

      {/* ============ 2.6 — MPC LOCK-IN VERIFICATION ============ */}
      <div className="promoter-card space-y-3">
        <span className="promoter-tag">2.6 — Minimum Promoter Contribution (MPC) Inputs</span>
        <div className="doc-cell-grid">
          <HighlighterField label="Pre-Issue Total Shares" hint="Total shares outstanding before this offer">
            <input
              type="number"
              value={data.preIssueTotalShares || ''}
              onChange={(e) => update('preIssueTotalShares', Number(e.target.value))}
              className={PAPER_INPUT}
            />
          </HighlighterField>
          <HighlighterField label="Pre-Issue Promoter Shares" hint="Promoter + Promoter Group shares before this offer">
            <input
              type="number"
              value={data.preIssuePromoterShares || ''}
              onChange={(e) => update('preIssuePromoterShares', Number(e.target.value))}
              className={PAPER_INPUT}
            />
          </HighlighterField>
        </div>
      </div>

      <div
        className={`rounded-xl border p-5 flex items-start gap-3 ${
          mpcMet ? 'border-emerald-300 bg-emerald-50/70' : 'border-red-300 bg-red-50/70'
        }`}
      >
        {mpcMet ? (
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
        )}
        <div>
          <p className={`text-xs font-black uppercase tracking-wider ${mpcMet ? 'text-emerald-800' : 'text-red-800'}`}>
            {mpcMet
              ? '✓ SEBI ICDR 20% MPC Requirement Met'
              : '⚠ SEBI ICDR 20% MPC Requirement Not Met'}
          </p>
          <p className="text-[10px] font-semibold text-slate-600 mt-1">
            Post-Issue Promoter Holding:{' '}
            <span className="font-bold text-slate-800">{postIssuePromoterPct.toFixed(2)}%</span> — computed as
            (Pre-Issue Promoter Shares − OFS Shares) ÷ (Pre-Issue Total Shares + Fresh Shares) × 100.
          </p>
        </div>
      </div>

      {/* ============ SUMMARY ============ */}
      <div className="ledger-summary">
        <div>
          <span className="ledger-label">Proposed Issue Size (Fresh)</span>
          <span className="ledger-value">₹{proposedFreshIssueSize.toLocaleString('en-IN')}</span>
        </div>
        <span className="ledger-tag-success">Capital structure questionnaire</span>
      </div>
    </div>
  );
}