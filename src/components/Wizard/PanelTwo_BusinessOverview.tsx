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

import { Plus, Trash2 } from 'lucide-react';

import HighlighterField from '../UI/HighlighterField';

import {
  WizardFormData,
  PAPER_INPUT,
  PAPER_SELECT,
  PAPER_TEXTAREA,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;

  update: <
    K extends keyof WizardFormData
  >(
    field: K,
    value: WizardFormData[K]
  ) => void;

  errors: Record<string, string>;
}

export default function PanelTwo_OfferDetails({
  data,
  update,
}: PanelProps) {
  const addSellingShareholder = () => {
    update(
      'sellingShareholders',
      [
        ...data.sellingShareholders,
        {
          name: '',
          sharesOffered: 0,
        },
      ]
    );
  };

  const removeSellingShareholder = (
    index: number
  ) => {
    update(
      'sellingShareholders',
      data.sellingShareholders.filter(
        (_, i) =>
          i !== index
      )
    );
  };

  return (
    <div className="paper-sheet-section space-y-9">

      <div className="doc-section-header">
        <span className="doc-section-eyebrow">
          Step 2
        </span>

        <h3 className="doc-section-title">
          Offer Details & Capital Structure
        </h3>

        <p className="doc-section-sub">
          Next, let's define the size of your offering
          and review your current capital structure and
          shareholding patterns.
        </p>
      </div>

      {/* AUTO DATA */}

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
            Auto-Extracted Capital Structure
          </p>

          <p className="text-[10px] text-slate-500 mt-1">
            These values should come from MGT-7,
            MoA and AoA after document processing.
          </p>
        </div>

        <div className="doc-cell-grid">
          <HighlighterField
            label="Authorised Capital"
          >
            <input
              type="number"
              value={
                data.authorisedCapital ||
                ''
              }
              onChange={e =>
                update(
                  'authorisedCapital',
                  Number(
                    e.target.value
                  )
                )
              }
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>

          <HighlighterField
            label="Paid-Up Capital"
          >
            <input
              type="number"
              value={
                data.paidUpCapital ||
                ''
              }
              onChange={e =>
                update(
                  'paidUpCapital',
                  Number(
                    e.target.value
                  )
                )
              }
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>

          <HighlighterField
            label="Promoter Shareholding (%)"
          >
            <input
              type="number"
              step="0.01"
              value={
                data.promoterShareholdingPercentage ||
                ''
              }
              onChange={e =>
                update(
                  'promoterShareholdingPercentage',
                  Number(
                    e.target.value
                  )
                )
              }
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>

          <HighlighterField
            label="FII Shareholding (%)"
          >
            <input
              type="number"
              step="0.01"
              value={
                data.fiiShareholdingPercentage ||
                ''
              }
              onChange={e =>
                update(
                  'fiiShareholdingPercentage',
                  Number(
                    e.target.value
                  )
                )
              }
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>
        </div>
      </div>

      {/* OFFER STRUCTURE */}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
            Q2.1 — Offer Structure
          </label>

          <p className="text-[10px] text-slate-500 mt-1">
            What exactly is being offered to public investors?
          </p>
        </div>

        <HighlighterField
          label="Select Offer Structure"
          required
        >
          <select
            value={
              data.offerStructure
            }
            onChange={e =>
              update(
                'offerStructure',
                e.target.value as
                  | 'Fresh Issue'
                  | 'Offer for Sale (OFS)'
                  | 'Combination'
                  | ''
              )
            }
            className={
              PAPER_SELECT
            }
          >
            <option value="">
              Select offer structure
            </option>

            <option value="Fresh Issue">
              Fresh Issue
            </option>

            <option value="Offer for Sale (OFS)">
              Offer for Sale (OFS)
            </option>

            <option value="Combination">
              Combination — Fresh Issue + OFS
            </option>
          </select>
        </HighlighterField>
      </div>

      {/* ISSUE SIZE */}

      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-4">
          Q2.2 — Proposed Issue Size
        </h4>

        <div className="doc-cell-grid">
          <HighlighterField
            label="Number of Shares Offered"
            required
          >
            <input
              type="number"
              value={
                data.proposedShares ||
                ''
              }
              onChange={e =>
                update(
                  'proposedShares',
                  Number(
                    e.target.value
                  )
                )
              }
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>

          <HighlighterField
            label="Face Value Per Equity Share"
            required
          >
            <input
              type="number"
              value={
                data.faceValuePerShare ||
                ''
              }
              onChange={e =>
                update(
                  'faceValuePerShare',
                  Number(
                    e.target.value
                  )
                )
              }
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>

          <HighlighterField
            label="Proposed Issue Size"
            required
          >
            <input
              type="number"
              value={
                data.issueSize ||
                ''
              }
              onChange={e => {
                const value =
                  Number(
                    e.target.value
                  );

                update(
                  'issueSize',
                  value
                );

                update(
                  'totalIssueSize',
                  value
                );
              }}
              className={
                PAPER_INPUT
              }
            />
          </HighlighterField>
        </div>
      </div>

      {/* OFS */}

      {(data.offerStructure ===
        'Offer for Sale (OFS)' ||
        data.offerStructure ===
          'Combination') && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Q2.3 — Selling Shareholders
              </h4>

              <p className="text-[10px] text-slate-500 mt-1">
                Required for OFS component.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addSellingShareholder
              }
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase"
            >
              <Plus className="w-3 h-3" />
              Add Shareholder
            </button>
          </div>

          {data.sellingShareholders.map(
            (
              shareholder,
              index
            ) => (
              <div
                key={index}
                className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end"
              >
                <HighlighterField
                  label="Selling Shareholder"
                  required
                >
                  <input
                    value={
                      shareholder.name
                    }
                    onChange={e => {
                      const next =
                        [
                          ...data.sellingShareholders,
                        ];

                      next[
                        index
                      ] = {
                        ...next[
                          index
                        ],
                        name:
                          e.target
                            .value,
                      };

                      update(
                        'sellingShareholders',
                        next
                      );
                    }}
                    className={
                      PAPER_INPUT
                    }
                  />
                </HighlighterField>

                <HighlighterField
                  label="Shares Offered"
                  required
                >
                  <input
                    type="number"
                    value={
                      shareholder.sharesOffered ||
                      ''
                    }
                    onChange={e => {
                      const next =
                        [
                          ...data.sellingShareholders,
                        ];

                      next[
                        index
                      ] = {
                        ...next[
                          index
                        ],
                        sharesOffered:
                          Number(
                            e.target
                              .value
                          ),
                      };

                      update(
                        'sellingShareholders',
                        next
                      );
                    }}
                    className={
                      PAPER_INPUT
                    }
                  />
                </HighlighterField>

                <button
                  type="button"
                  onClick={() =>
                    removeSellingShareholder(
                      index
                    )
                  }
                  className="h-10 w-10 flex items-center justify-center text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* OBJECTS OF OFFER */}

      <HighlighterField
        label="Q2.4 — Objects of the Offer"
        required
      >
        <textarea
          rows={6}
          value={
            data.objectsOfOffer
          }
          onChange={e =>
            update(
              'objectsOfOffer',
              e.target.value
            )
          }
          className={
            PAPER_TEXTAREA
          }
          placeholder="Explain the primary purpose for which IPO proceeds will be utilised — capital augmentation, debt repayment, working capital, general corporate purposes, etc."
        />
      </HighlighterField>

      {/* ESOP */}

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Q2.5 — ESOP Details
          </h4>

          <p className="text-[10px] text-slate-500 mt-1">
            Provide details if an active Employee Stock Option Plan exists.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold">
          <input
            type="checkbox"
            checked={
              data.esopDetails
                .active
            }
            onChange={e =>
              update(
                'esopDetails',
                {
                  ...data.esopDetails,
                  active:
                    e.target.checked,
                }
              )
            }
          />

          Active ESOP exists
        </label>

        {data.esopDetails
          .active && (
          <div className="doc-cell-grid">
            <HighlighterField
              label="ESOP Pool Size"
              required
            >
              <input
                type="number"
                value={
                  data.esopDetails
                    .poolSize ||
                  ''
                }
                onChange={e =>
                  update(
                    'esopDetails',
                    {
                      ...data.esopDetails,
                      poolSize:
                        Number(
                          e.target
                            .value
                        ),
                    }
                  )
                }
                className={
                  PAPER_INPUT
                }
              />
            </HighlighterField>

            <div className="md:col-span-2">
              <HighlighterField
                label="Vesting Schedule"
                required
              >
                <textarea
                  rows={3}
                  value={
                    data.esopDetails
                      .vestingSchedule
                  }
                  onChange={e =>
                    update(
                      'esopDetails',
                      {
                        ...data.esopDetails,
                        vestingSchedule:
                          e.target
                            .value,
                      }
                    )
                  }
                  className={
                    PAPER_TEXTAREA
                  }
                />
              </HighlighterField>
            </div>
          </div>
        )}
      </div>

      {/* SUMMARY */}

      <div className="ledger-summary">
        <div>
          <span className="ledger-label">
            Proposed Issue Size
          </span>

          <span className="ledger-value">
            ₹
            {Number(
              data.issueSize || 0
            ).toLocaleString(
              'en-IN'
            )}
          </span>
        </div>

        <span className="ledger-tag-success">
          Capital structure questionnaire
        </span>
      </div>
    </div>
  );
}