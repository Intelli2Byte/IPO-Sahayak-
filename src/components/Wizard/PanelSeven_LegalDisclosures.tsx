'use client';

import HighlighterField from '../ui/HighlighterField';
import InkRadio from '../ui/InkRadio';
import InkCheckbox from '../ui/InkCheckbox';
import { WizardFormData, PAPER_INPUT } from './wizardTypes';

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
      <p className="text-xs font-semibold text-slate-700 leading-relaxed flex-1">{question}</p>
      <div className="flex items-center gap-5 shrink-0">
        <InkRadio name={name} value="yes" checked={value === 'yes'} onChange={() => onChange('yes')} label="Yes" />
        <InkRadio name={name} value="no" checked={value === 'no'} onChange={() => onChange('no')} label="No" />
      </div>
    </div>
  );
}

export default function PanelSeven_LegalDisclosures({ data, update }: PanelProps) {
  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Section VII</span>
        <h3 className="doc-section-title">Legal Disclosures &amp; Compliance Declarations</h3>
        <p className="doc-section-sub">
          This section forms an official affidavit. Answer each declaration truthfully — inaccurate disclosure is a
          SEBI compliance violation.
        </p>
      </div>

      <div className="doc-cell-grid">
        <HighlighterField label="Total Litigations Involving the Company" required>
          <input type="number" value={data.litigationsCount} onChange={(e) => update('litigationsCount', parseInt(e.target.value) || 0)} className={PAPER_INPUT} />
        </HighlighterField>
        <HighlighterField label="Pending Tax Disputes" required>
          <input type="number" value={data.taxDisputesCount} onChange={(e) => update('taxDisputesCount', parseInt(e.target.value) || 0)} className={PAPER_INPUT} />
        </HighlighterField>
      </div>

      <div className="affidavit-block">
        <AffidavitQuestion
          question="Is there any pending litigation, civil or criminal, involving the company, its promoters, or its directors?"
          name="pendingLitigation"
          value={data.hasPendingLitigation}
          onChange={(v) => update('hasPendingLitigation', v)}
        />
        <AffidavitQuestion
          question="Has the company or any of its promoters been subject to regulatory or statutory action by SEBI, RBI, MCA, or any other authority?"
          name="regulatoryAction"
          value={data.hasRegulatoryAction}
          onChange={(v) => update('hasRegulatoryAction', v)}
        />
        <AffidavitQuestion
          question="Has the company or any promoter defaulted on repayment of statutory dues, bank loans, or debentures?"
          name="defaultHistory"
          value={data.hasDefaultHistory}
          onChange={(v) => update('hasDefaultHistory', v)}
        />
      </div>

      <div className="space-y-3 border-t border-slate-200/70 pt-6">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Compliance Confirmations</p>
        <InkCheckbox checked={data.complianceCheck1} onChange={(v) => update('complianceCheck1', v)} label="All statutory filings under the Companies Act, 2013 are current and up to date." />
        <InkCheckbox checked={data.complianceCheck2} onChange={(v) => update('complianceCheck2', v)} label="The company has obtained all material licenses and regulatory approvals required for its operations." />
        <InkCheckbox checked={data.complianceCheck3} onChange={(v) => update('complianceCheck3', v)} label="No material adverse event has occurred since the date of the last audited financial statements." />
      </div>
    </div>
  );
}