'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Building2, Briefcase, DollarSign, LineChart, TrendingUp, ShieldAlert, FileCheck, Stamp, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';

import PanelOne_CorporateIdentity from './PanelOne_CorporateIdentity';
import PanelTwo_BusinessOverview from './PanelTwo_BusinessOverview';
import PanelThree_FinancialDossier from './PanelThree_FinancialDossier';
import PanelFour_MarketChannels from './PanelFour_MarketChannels';
import PanelFive_UseOfFundsLedger, { useOfFundsIsBalanced } from './PanelFive_UseOfFundsLedger';
import PanelSix_RiskAssessment from './PanelSix_RiskAssessment';
import PanelSeven_LegalDisclosures from './PanelSeven_LegalDisclosures';
import PanelEight_FinalReview from './PanelEight_FinalReview';
import { WizardFormData, DEFAULT_WIZARD_DATA } from './wizardTypes';

const STORAGE_KEY = 'amti-ipo-wizard-state';

const STEPS = [
  { num: 1, name: 'Corporate Identity', icon: Building2 },
  { num: 2, name: 'Business Overview', icon: Briefcase },
  { num: 3, name: 'Financial Dossier', icon: DollarSign },
  { num: 4, name: 'Market Channels', icon: LineChart },
  { num: 5, name: 'Use of Funds', icon: TrendingUp },
  { num: 6, name: 'Risk Assessment', icon: ShieldAlert },
  { num: 7, name: 'Legal Disclosures', icon: FileCheck },
  { num: 8, name: 'Review & Seal', icon: Stamp },
];

function validateStep(step: number, d: WizardFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  switch (step) {
    case 1:
      if (!d.cin || d.cin.length !== 21) errors.cin = 'A valid 21-character CIN is required.';
      if (!d.companyName) errors.companyName = 'Company name is required.';
      break;
    case 2:
      if (d.businessModel.length < 300) errors.businessModel = 'Business description must be at least 300 characters.';
      if (d.products.length === 0 || d.products.some((p) => !p.name)) errors.products = 'Every product/service needs a name.';
      break;
    case 3:
      if (d.fy26Revenue <= 0) errors.fy26Revenue = 'Most recent fiscal year revenue is required.';
      if (d.attachedDocs.length === 0) errors.attachedDocs = 'At least one supporting financial document must be attached.';
      break;
    case 4:
      if (!d.marketChannels.some((c) => c.checked)) errors.channels = 'Select at least one monetization channel.';
      break;
    case 5:
      if (!useOfFundsIsBalanced(d)) errors.ledger = 'Use of Funds ledger must total exactly 100%.';
      break;
    case 6:
      if (d.risks.some((r) => !r.title || !r.description)) errors.risks = 'All mandatory risk factors must be completed.';
      break;
    case 7:
      if (!d.hasPendingLitigation) errors.affidavit = 'Affidavit declarations must be answered.';
      break;
  }
  return errors;
}

export default function StepWizard() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [formData, setFormData] = useState<WizardFormData>(DEFAULT_WIZARD_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [highestStepVisited, setHighestStepVisited] = useState<number>(1);

  const sheetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.formData) setFormData({ ...DEFAULT_WIZARD_DATA, ...parsed.formData });
        if (parsed.currentStep) {
          setActiveStep(parsed.currentStep);
          setHighestStepVisited(Math.max(parsed.currentStep, parsed.highestStepVisited || 1));
        }
      }
    } catch {} finally {
      setHydrated(true);
      if (containerRef.current) gsap.fromTo(containerRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, []);

  const update = useCallback(<K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep: activeStep, formData: next, highestStepVisited }));
      return next;
    });
  }, [activeStep, highestStepVisited]);

  const animateTurn = (direction: 1 | -1, after: () => void) => {
    if (!sheetRef.current) return after();
    gsap.to(sheetRef.current, {
      opacity: 0, y: direction * 10, duration: 0.15, ease: 'power2.in',
      onComplete: () => {
        after();
        window.scrollTo({ top: 0, behavior: 'instant' });
        gsap.fromTo(sheetRef.current, { opacity: 0, y: direction * -10 }, { opacity: 1, y: 0, duration: 0.25 });
      },
    });
  };

  const goToStep = (target: number) => {
    if (target === activeStep) return;
    setHighestStepVisited((prev) => Math.max(prev, target));
    setErrors({});
    animateTurn(target > activeStep ? 1 : -1, () => setActiveStep(target));
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    setErrors({});
    goToStep(Math.min(activeStep + 1, 8));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div ref={containerRef} className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-slate-800 pb-5 mb-8">
          <div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Statutory Filing Portal</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">DRHP Application Dossier</h1>
          </div>
        </div>

        {/* Dynamic Step Tracker */}
        <div className="bg-white border border-slate-300 shadow-sm p-5 mb-8">
          <div className="relative flex items-center justify-between w-full px-4">
            <div className="absolute left-10 right-10 top-5 h-1 bg-slate-100 z-0 border-y border-slate-200">
              <div className="h-full bg-[#1E3A8A] transition-all duration-500" style={{ width: `${((activeStep - 1) / 7) * 100}%` }} />
            </div>
            
            {STEPS.map((step) => {
              const isActive = activeStep === step.num;
              const isPast = step.num < activeStep || step.num < highestStepVisited;
              const hasErrors = Object.keys(validateStep(step.num, formData)).length > 0;

              let circleClass = 'border-slate-300 text-slate-400 bg-white';
              let circleText = step.num.toString();
              let textClass = 'text-slate-400';

              if (isActive) {
                circleClass = 'border-[#1E3A8A] text-[#1E3A8A] shadow-[0_0_0_4px_rgba(30,58,138,0.1)] bg-white';
                textClass = 'text-[#0F172A]';
              } else if (isPast) {
                if (hasErrors) {
                  circleClass = 'border-red-600 text-red-700 bg-red-50';
                  circleText = '!';
                  textClass = 'text-red-700';
                } else {
                  circleClass = 'border-emerald-600 text-emerald-700 bg-emerald-50';
                  circleText = '✓';
                  textClass = 'text-emerald-700';
                }
              }

              return (
                <button key={step.num} onClick={() => goToStep(step.num)} className="flex flex-col items-center relative z-10 cursor-pointer flex-1 outline-none">
                  <div className={`w-10 h-10 border-2 flex items-center justify-center text-xs font-black transition-all ${circleClass}`}>
                    {circleText}
                  </div>
                  <span className={`text-[10px] text-center mt-3 max-w-[80px] leading-tight font-black uppercase tracking-wide transition-colors ${textClass}`}>
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Canvas */}
        <div className="bg-white border border-slate-300 shadow-sm">
          <div ref={sheetRef} className="p-8 md:p-12">
            {activeStep === 1 && <PanelOne_CorporateIdentity data={formData} update={update} errors={errors} />}
            {activeStep === 2 && <PanelTwo_BusinessOverview data={formData} update={update} errors={errors} />}
            {activeStep === 3 && <PanelThree_FinancialDossier data={formData} update={update} errors={errors} />}
            {activeStep === 4 && <PanelFour_MarketChannels data={formData} update={update} errors={errors} />}
            {activeStep === 5 && <PanelFive_UseOfFundsLedger data={formData} update={update} errors={errors} />}
            {activeStep === 6 && <PanelSix_RiskAssessment data={formData} update={update} errors={errors} />}
            {activeStep === 7 && <PanelSeven_LegalDisclosures data={formData} update={update} errors={errors} />}
            {activeStep === 8 && <PanelEight_FinalReview data={formData} update={update} errors={errors} onGenerateDrhp={() => alert('Sealed & Submitted!')} />}

            {Object.keys(errors).length > 0 && (
              <div className="mt-10 p-4 bg-red-50 border-l-4 border-red-700 text-red-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider block mb-1">Administrative Block</span>
                  <span className="text-sm font-semibold">{Object.values(errors)[0]}</span>
                </div>
              </div>
            )}

            {activeStep < 8 && (
              <div className="flex justify-end pt-8 mt-12 border-t-2 border-slate-200">
                <button onClick={handleNext} className="bg-[#1E3A8A] hover:bg-[#152C69] text-white px-8 py-3 text-xs font-black uppercase flex items-center gap-3">
                  <span>Save &amp; Proceed to Section {activeStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}