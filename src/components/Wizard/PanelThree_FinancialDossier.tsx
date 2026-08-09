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

import {
  Plus,
  Trash2,
} from 'lucide-react';

import HighlighterField from '../ui/HighlighterField';

import {
  WizardFormData,
  PAPER_INPUT,
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

export default function PanelThree_BusinessOperations({
  data,
  update,
}: PanelProps) {
  const addContract = () => {
    update(
      'materialContracts',
      [
        ...data.materialContracts,
        {
          counterparty: '',
          description: '',
          tenure: '',
          renewalTerms: '',
        },
      ]
    );
  };

  const removeContract = (
    index: number
  ) => {
    update(
      'materialContracts',
      data.materialContracts.filter(
        (_, i) =>
          i !== index
      )
    );
  };

  return (
    <div className="paper-sheet-section space-y-9">

      {/* HEADER */}

      <div className="doc-section-header">
        <span className="doc-section-eyebrow">
          Step 3
        </span>

        <h3 className="doc-section-title">
          Industry & Business Operations
        </h3>

        <p className="doc-section-sub">
          Help investors understand your core business
          model, operational footprint, technology,
          partnerships and competitive positioning.
        </p>
      </div>

      {/* AUTO EXTRACTED */}

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
            Auto-Extracted From Annual Report
          </p>

          <p className="text-[10px] text-slate-500 mt-1">
            These sections will eventually be populated
            automatically from uploaded annual reports.
          </p>
        </div>

        <HighlighterField
          label="Core Operational Pillars"
        >
          <textarea
            rows={4}
            value={
              data.coreOperationalPillars
            }
            onChange={e =>
              update(
                'coreOperationalPillars',
                e.target.value
              )
            }
            className={
              PAPER_TEXTAREA
            }
            placeholder="Example: Borrow, Invest, Transact, Protect"
          />
        </HighlighterField>

        <div className="mt-4">
          <HighlighterField
            label="Joint Ventures / Partnerships"
          >
            <textarea
              rows={5}
              value={
                data.jointVenturesPartnerships
              }
              onChange={e =>
                update(
                  'jointVenturesPartnerships',
                  e.target.value
                )
              }
              className={
                PAPER_TEXTAREA
              }
              placeholder="Describe material JVs, strategic partnerships and ownership structures."
            />
          </HighlighterField>
        </div>
      </div>

      {/* COMPETITIVE NARRATIVE */}

      <HighlighterField
        label="Q3.1 — Competitive Narrative"
        required
      >
        <textarea
          rows={7}
          value={
            data.competitiveNarrative
          }
          onChange={e =>
            update(
              'competitiveNarrative',
              e.target.value
            )
          }
          className={
            PAPER_TEXTAREA
          }
          placeholder="Describe the company's positioning, target customers, competitive advantages, differentiation and key value proposition versus primary market competitors."
        />
      </HighlighterField>

      {/* TECHNOLOGY */}

      <HighlighterField
        label="Q3.2 — Proprietary Technology & Digital Infrastructure"
        required
      >
        <textarea
          rows={7}
          value={
            data.proprietaryTechnology
          }
          onChange={e =>
            update(
              'proprietaryTechnology',
              e.target.value
            )
          }
          className={
            PAPER_TEXTAREA
          }
          placeholder="Describe proprietary platforms, digital infrastructure, technology architecture, analytics capabilities, APIs, customer applications, risk engines or other technology relevant to the business."
        />
      </HighlighterField>

      {/* BUSINESS MODEL */}

      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-4">
          Q3.3 — Business Model
        </h4>

        <HighlighterField
          label="How does the company generate revenue?"
          required
        >
          <textarea
            rows={6}
            value={
              data.businessModel
            }
            onChange={e =>
              update(
                'businessModel',
                e.target.value
              )
            }
            className={
              PAPER_TEXTAREA
            }
            placeholder="Explain the company's major revenue streams and operating model."
          />
        </HighlighterField>
      </div>

      {/* USP */}

      <HighlighterField
        label="Q3.4 — Unique Selling Proposition"
        required
      >
        <textarea
          rows={5}
          value={data.usp}
          onChange={e =>
            update(
              'usp',
              e.target.value
            )
          }
          className={
            PAPER_TEXTAREA
          }
          placeholder="What makes the company's offering different or defensible?"
        />
      </HighlighterField>

      {/* PRODUCTS */}

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Q3.5 — Products / Business Verticals
            </h4>

            <p className="text-[10px] text-slate-500 mt-1">
              Add the major products, services or verticals.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              update(
                'products',
                [
                  ...data.products,
                  {
                    name: '',
                    description: '',
                    revenueContribution: 0,
                    category:
                      'Business Vertical',
                  },
                ]
              )
            }
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        <div className="space-y-4">
          {data.products.map(
            (
              product,
              index
            ) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-slate-500">
                    Product / Vertical #
                    {index + 1}
                  </span>

                  {data.products
                    .length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          'products',
                          data.products.filter(
                            (
                              _,
                              i
                            ) =>
                              i !==
                              index
                          )
                        )
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="doc-cell-grid">
                  <HighlighterField
                    label="Product / Vertical Name"
                    required
                  >
                    <input
                      value={
                        product.name
                      }
                      onChange={e => {
                        const next =
                          [
                            ...data.products,
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
                          'products',
                          next
                        );
                      }}
                      className={
                        PAPER_INPUT
                      }
                    />
                  </HighlighterField>

                  <HighlighterField
                    label="Revenue Contribution (%)"
                  >
                    <input
                      type="number"
                      value={
                        product.revenueContribution ||
                        ''
                      }
                      onChange={e => {
                        const next =
                          [
                            ...data.products,
                          ];

                        next[
                          index
                        ] = {
                          ...next[
                            index
                          ],
                          revenueContribution:
                            Number(
                              e
                                .target
                                .value
                            ),
                        };

                        update(
                          'products',
                          next
                        );
                      }}
                      className={
                        PAPER_INPUT
                      }
                    />
                  </HighlighterField>

                  <HighlighterField
                    label="Category"
                  >
                    <input
                      value={
                        product.category
                      }
                      onChange={e => {
                        const next =
                          [
                            ...data.products,
                          ];

                        next[
                          index
                        ] = {
                          ...next[
                            index
                          ],
                          category:
                            e
                              .target
                              .value,
                        };

                        update(
                          'products',
                          next
                        );
                      }}
                      className={
                        PAPER_INPUT
                      }
                    />
                  </HighlighterField>

                  <div className="md:col-span-3">
                    <HighlighterField
                      label="Description"
                    >
                      <textarea
                        rows={3}
                        value={
                          product.description
                        }
                        onChange={e => {
                          const next =
                            [
                              ...data.products,
                            ];

                          next[
                            index
                          ] = {
                            ...next[
                              index
                            ],
                            description:
                              e
                                .target
                                .value,
                          };

                          update(
                            'products',
                            next
                          );
                        }}
                        className={
                          PAPER_TEXTAREA
                        }
                      />
                    </HighlighterField>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* MATERIAL CONTRACTS */}

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Q3.6 — Material Contracts
            </h4>

            <p className="text-[10px] text-slate-500 mt-1">
              Include material commercial agreements not
              already adequately covered by uploaded reports.
            </p>
          </div>

          <button
            type="button"
            onClick={
              addContract
            }
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase"
          >
            <Plus className="w-3 h-3" />
            Add Contract
          </button>
        </div>

        {data.materialContracts.length ===
          0 && (
          <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">
            <p className="text-[10px] text-slate-500">
              No material contracts added yet.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {data.materialContracts.map(
            (
              contract,
              index
            ) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-slate-500">
                    Material Contract #
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeContract(
                        index
                      )
                    }
                    className="text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="doc-cell-grid">
                  <HighlighterField
                    label="Counterparty"
                    required
                  >
                    <input
                      value={
                        contract.counterparty
                      }
                      onChange={e => {
                        const next =
                          [
                            ...data.materialContracts,
                          ];

                        next[
                          index
                        ] = {
                          ...next[
                            index
                          ],
                          counterparty:
                            e
                              .target
                              .value,
                        };

                        update(
                          'materialContracts',
                          next
                        );
                      }}
                      className={
                        PAPER_INPUT
                      }
                    />
                  </HighlighterField>

                  <HighlighterField
                    label="Tenure"
                  >
                    <input
                      value={
                        contract.tenure
                      }
                      onChange={e => {
                        const next =
                          [
                            ...data.materialContracts,
                          ];

                        next[
                          index
                        ] = {
                          ...next[
                            index
                          ],
                          tenure:
                            e
                              .target
                              .value,
                        };

                        update(
                          'materialContracts',
                          next
                        );
                      }}
                      className={
                        PAPER_INPUT
                      }
                    />
                  </HighlighterField>

                  <HighlighterField
                    label="Renewal Terms"
                  >
                    <input
                      value={
                        contract.renewalTerms
                      }
                      onChange={e => {
                        const next =
                          [
                            ...data.materialContracts,
                          ];

                        next[
                          index
                        ] = {
                          ...next[
                            index
                          ],
                          renewalTerms:
                            e
                              .target
                              .value,
                        };

                        update(
                          'materialContracts',
                          next
                        );
                      }}
                      className={
                        PAPER_INPUT
                      }
                    />
                  </HighlighterField>

                  <div className="md:col-span-3">
                    <HighlighterField
                      label="Contract Description"
                    >
                      <textarea
                        rows={4}
                        value={
                          contract.description
                        }
                        onChange={e => {
                          const next =
                            [
                              ...data.materialContracts,
                            ];

                          next[
                            index
                          ] = {
                            ...next[
                              index
                            ],
                            description:
                              e
                                .target
                                .value,
                          };

                          update(
                            'materialContracts',
                            next
                          );
                        }}
                        className={
                          PAPER_TEXTAREA
                        }
                      />
                    </HighlighterField>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* SUMMARY */}

      <div className="ledger-summary">
        <div>
          <span className="ledger-label">
            Business & Industry Information
          </span>

          <span className="ledger-value">
            Step 3
          </span>
        </div>

        <span className="ledger-tag-success">
          Ready for DRHP business narrative
        </span>
      </div>
    </div>
  );
}