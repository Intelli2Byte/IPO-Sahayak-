'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import HighlighterField from '../ui/HighlighterField';
import InkCheckbox from '../ui/InkCheckbox';
import { WizardFormData, RiskItem, PAPER_INPUT, PAPER_TEXTAREA } from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

export default function PanelSix_RiskAssessment({ data, update }: PanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (data.hasOtherRisks) {
      gsap.fromTo(
        scrollRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out' }
      );
    } else {
      gsap.to(scrollRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [data.hasOtherRisks]);

  const updateRisk = (idx: number, field: keyof RiskItem, value: string) => {
    const updated = [...data.risks];
    updated[idx] = { ...updated[idx], [field]: value };
    update('risks', updated);
  };

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Section VI</span>
        <h3 className="doc-section-title">Risk Assessment Checklist</h3>
        <p className="doc-section-sub">SEBI-mandated disclosure: a minimum of five distinct risk factors is required.</p>
      </div>

      <div className="space-y-5">
        {data.risks.map((risk, idx) => (
          <div key={idx} className="promoter-card">
            <span className="promoter-tag">Risk {idx + 1} — {risk.category}</span>
            <div className="doc-cell-grid mt-3">
              <HighlighterField label="Risk Title" required>
                <input type="text" value={risk.title} onChange={(e) => updateRisk(idx, 'title', e.target.value)} placeholder="Short, factual risk heading" className={PAPER_INPUT} />
              </HighlighterField>
              <div className="md:col-span-2">
                <HighlighterField label="Risk Description" required>
                  <textarea rows={2} value={risk.description} onChange={(e) => updateRisk(idx, 'description', e.target.value)} placeholder="Explain the nature, likelihood, and potential impact of this risk…" className={PAPER_TEXTAREA} />
                </HighlighterField>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200/70 pt-6 space-y-3">
        <InkCheckbox
          checked={data.hasOtherRisks}
          onChange={(checked) => update('hasOtherRisks', checked)}
          label="There are additional, company-specific risks not covered above ('Other Risks')."
        />
        <div ref={scrollRef} className="overflow-hidden" style={{ height: data.hasOtherRisks ? 'auto' : 0, opacity: data.hasOtherRisks ? 1 : 0 }}>
          <div className="unrolled-scroll mt-3">
            <HighlighterField label="Describe the Other Risk(s)" required>
              <textarea rows={4} value={data.otherRisksDescription} onChange={(e) => update('otherRisksDescription', e.target.value)} placeholder="Provide full factual detail for each additional risk…" className={PAPER_TEXTAREA} />
            </HighlighterField>
          </div>
        </div>
      </div>
    </div>
  );
}