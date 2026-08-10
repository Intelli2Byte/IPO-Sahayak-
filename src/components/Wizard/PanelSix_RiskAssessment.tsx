'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  Lock,
  ShieldAlert,
  Users,
  Cpu,
  CheckCircle2,
  X,
  ChevronDown,
} from 'lucide-react';
import HighlighterField from '../UI/HighlighterField';
import DocumentUploadZone from './DocumentUploadZone';
import {
  WizardFormData,
  RiskItem,
  PAPER_INPUT,
  PAPER_TEXTAREA,
  RELATED_PARTY_OPTIONS,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

export default function PanelSix_RiskAssessment({ data, update }: PanelProps) {
  const splitScreenRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [zoneHasData, setZoneHasData] = useState(data.riskExtractionStatus === 'done');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ---------------------------------------------------------
     Close related-party dropdown when clicking outside it.
     --------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateRisk = (idx: number, field: keyof RiskItem, value: string) => {
    const updated = [...data.risks];
    updated[idx] = { ...updated[idx], [field]: value };
    update('risks', updated);
  };

  const toggleRelatedParty = (entity: string) => {
    const exists = data.relatedPartyRiskEntities.includes(entity);
    const updated = exists
      ? data.relatedPartyRiskEntities.filter((e) => e !== entity)
      : [...data.relatedPartyRiskEntities, entity];
    update('relatedPartyRiskEntities', updated);
  };

  const handleRiskDocUpload = (extracted: any) => {
    if (typeof extracted.contingentLiabilitiesNotAcknowledged === 'number') {
      update('contingentLiabilitiesNotAcknowledged', extracted.contingentLiabilitiesNotAcknowledged);
    }
    if (typeof extracted.outstandingIndebtednessFundBased === 'number') {
      update('outstandingIndebtednessFundBased', extracted.outstandingIndebtednessFundBased);
    }
    if (Array.isArray(extracted.risks) && extracted.risks.length > 0) {
      update('risks', extracted.risks);
    }
    if (typeof extracted.materialityThresholdPercent === 'number') {
      update('materialityThresholdPercent', extracted.materialityThresholdPercent);
    }
    if (typeof extracted.materialityThresholdAmount === 'number') {
      update('materialityThresholdAmount', extracted.materialityThresholdAmount);
    }
    if (Array.isArray(extracted.relatedPartyRiskEntities)) {
      update('relatedPartyRiskEntities', extracted.relatedPartyRiskEntities);
    }
    if (typeof extracted.cyberTechRiskDescription === 'string') {
      update('cyberTechRiskDescription', extracted.cyberTechRiskDescription);
    }

    update('riskExtractionStatus', 'done');
    setZoneHasData(true);

    requestAnimationFrame(() => {
      if (splitScreenRef.current) {
        gsap.fromTo(
          splitScreenRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
      }
    });
  };

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow font-sans">Section VI</span>
        <h3 className="doc-section-title font-display">Risk Assessment &amp; Legal Disclosures</h3>
        <p className="doc-section-sub font-sans">
          SEBI mandates a rigorous disclosure of internal and external risks. Upload your internal
          risk register — the AI will draft the legal narratives below.
        </p>
      </div>

      {/* 6.1 DOCUMENT INGESTION */}
      <div className="space-y-3">
        <span className="text-xs font-black text-slate-600 uppercase tracking-wider font-sans block mb-1">
          6.1 — Document Ingestion
        </span>

        <DocumentUploadZone
          documentType="risk-register"
          title="Internal Risk Management Register & Industry Report"
          description="Upload your risk register and industry report for AI-based risk extraction"
          onUploadComplete={handleRiskDocUpload}
          extractedData={zoneHasData ? { ok: true } : null}
        />
      </div>

      {/* SPLIT-SCREEN REVEAL */}
      {data.riskExtractionStatus === 'done' && (
        <div ref={splitScreenRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t-2 border-slate-200 pt-8">
          {/* LEFT COLUMN — AI DRAFTED RISK NARRATIVES */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-sans">
                ⚡ AI Drafted Risk Narratives
              </span>
            </div>

            {/* 6.2 INHERITED FINANCIAL RISKS */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-sans">
                🔒 6.2 — Inherited Financial Risks
              </p>
              <p className="text-[10px] text-slate-500 font-semibold font-sans">
                (Extracted from Step 3: Financial Dossier)
              </p>

              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-sans">
                    Contingent Liabilities Not Acknowledged
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-sm font-extrabold text-slate-400">₹</span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={data.contingentLiabilitiesNotAcknowledged.toLocaleString('en-IN')}
                      className="w-full pl-8 pr-9 py-3 text-sm border border-slate-300 rounded-md bg-slate-100 font-mono font-bold text-slate-700 outline-none cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-sans">
                    Outstanding Indebtedness (Fund Based)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-sm font-extrabold text-slate-400">₹</span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={data.outstandingIndebtednessFundBased.toLocaleString('en-IN')}
                      className="w-full pl-8 pr-9 py-3 text-sm border border-slate-300 rounded-md bg-slate-100 font-mono font-bold text-slate-700 outline-none cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* 6.3 AI-DRAFTED CORE RISK FACTORS */}
            <div className="space-y-5 border-t border-slate-200/70 pt-5">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans block">
                ✍️ 6.3 — AI-Drafted Core Risk Factors
              </span>

              {data.risks.map((risk, idx) => (
                <div key={idx} className="promoter-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="promoter-tag font-sans">
                      Risk {idx + 1}: {risk.title}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-wide rounded font-sans shrink-0">
                      🤖 AI Drafted
                    </span>
                  </div>

                  <HighlighterField label="Risk Title" required>
                    <input
                      type="text"
                      value={risk.title}
                      onChange={(e) => updateRisk(idx, 'title', e.target.value)}
                      placeholder="Short, factual risk heading"
                      className={PAPER_INPUT}
                    />
                  </HighlighterField>

                  <HighlighterField label="Risk Description" required>
                    <textarea
                      rows={3}
                      value={risk.description}
                      onChange={(e) => updateRisk(idx, 'description', e.target.value)}
                      placeholder="Explain the nature, likelihood, and potential impact of this risk…"
                      className={PAPER_TEXTAREA}
                    />
                  </HighlighterField>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — MANUAL VERIFICATION & INPUTS */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-sans">
                📝 Manual Verification &amp; Inputs
              </span>
            </div>

            {/* 6.4 MATERIALITY THRESHOLDS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans">
                  ⚖️ 6.4 — Materiality Thresholds
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold font-sans">
                Define the threshold for material litigation as per your Board Policy.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block font-sans">
                  {data.materialityThresholdPercent}% of Net Worth (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-sm font-extrabold text-slate-400">₹</span>
                  </div>
                  <input
                    type="text"
                    value={data.materialityThresholdAmount.toLocaleString('en-IN')}
                    onChange={(e) =>
                      update(
                        'materialityThresholdAmount',
                        parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0
                      )
                    }
                    className="w-full pl-8 pr-4 py-3 text-sm border border-slate-300 rounded-md bg-[#fffdf8] focus:border-primary focus:outline-none font-mono font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 6.5 RELATED PARTY RISKS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans">
                  🤝 6.5 — Related Party Risks
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold font-sans">
                Which specific related parties pose the highest operational dependency risk?
              </p>

              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs border border-slate-300 rounded-md bg-[#fffdf8] font-bold text-slate-700 font-sans"
                >
                  <span>Select related parties…</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg max-h-52 overflow-y-auto">
                    {RELATED_PARTY_OPTIONS.map((opt) => {
                      const selected = data.relatedPartyRiskEntities.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleRelatedParty(opt)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left font-sans hover:bg-slate-50 ${
                            selected ? 'text-primary bg-slate-50' : 'text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {data.relatedPartyRiskEntities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.relatedPartyRiskEntities.map((entity) => (
                    <span
                      key={entity}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-700 font-sans"
                    >
                      {entity}
                      <button
                        type="button"
                        onClick={() => toggleRelatedParty(entity)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 6.6 MANUAL RISK ENTRY (OPTIONAL) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider font-sans">
                  🎯 6.6 — Manual Risk Entry (Optional)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold font-sans">
                Are there any highly specific cyber or technological risks to highlight?
              </p>
              <textarea
                rows={4}
                value={data.cyberTechRiskDescription}
                onChange={(e) => update('cyberTechRiskDescription', e.target.value)}
                placeholder="Describe any additional cyber, IT infrastructure, or technology-transition risks…"
                className={PAPER_TEXTAREA}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}