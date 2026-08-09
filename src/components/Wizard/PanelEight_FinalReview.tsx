'use client';

import { useState, useRef } from 'react';
import { Check, ShieldCheck, ArrowRight, Lock, PenTool } from 'lucide-react';
import HighlighterField from '../ui/HighlighterField';
import EvidenceUpload from '../ui/EvidenceUpload';
import { WizardFormData, PAPER_INPUT } from './wizardTypes';

export default function PanelEight_FinalReview({ data, update, onGenerateDrhp }: any) {
  const [signatureFile, setSignatureFile] = useState<string | null>(null);

  const handleSignatureUpload = (fileName: string) => {
    setSignatureFile(fileName);
    update('signatureVerified', true);
  };

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Section VIII</span>
        <h3 className="doc-section-title">Final Review & Authorization</h3>
        <p className="doc-section-sub">Certify the filing with a verifiable e-signature or wet-ink scan.</p>
      </div>

      <div className="p-6 border border-slate-300 bg-slate-50">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4">Authorized Signatory Declaration</p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <HighlighterField label="Signatory Full Name" required>
            <input type="text" value={data.signatoryName} onChange={(e) => update('signatoryName', e.target.value)} className={PAPER_INPUT} />
          </HighlighterField>
          <HighlighterField label="Designation" required>
            <input type="text" value={data.signatoryDesignation} onChange={(e) => update('signatoryDesignation', e.target.value)} className={PAPER_INPUT} />
          </HighlighterField>
        </div>

        <div className="bg-white p-6 border border-slate-200">
          <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-2 mb-4">
            <PenTool className="w-4 h-4 text-[#1E3A8A]" /> Affix Digital Signature
          </h4>
          
          {!signatureFile ? (
            <EvidenceUpload 
              label="Upload Signature Scan / DSC Token (PNG, JPG, PDF)" 
              onUpload={handleSignatureUpload} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-emerald-500 bg-emerald-50 rounded-lg">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
              <span className="text-sm font-black text-emerald-800 uppercase tracking-wide">Signature Authenticated</span>
              <span className="text-[10px] font-bold text-emerald-600 mt-1">File: {signatureFile}</span>
              <button onClick={() => setSignatureFile(null)} className="mt-4 text-[10px] text-red-600 font-bold uppercase underline">Remove Signature</button>
            </div>
          )}
        </div>
      </div>

      <div className={`p-8 border flex flex-col items-center text-center ${!signatureFile ? 'bg-slate-100 border-slate-300 opacity-50' : 'bg-white border-[#1E3A8A]'}`}>
        {!signatureFile ? (
          <>
            <Lock className="w-6 h-6 text-slate-400 mb-2" />
            <span className="text-xs font-black text-slate-500 uppercase">Sign Document to Unlock Final Submission</span>
          </>
        ) : (
          <button
            onClick={onGenerateDrhp}
            className="px-8 py-4 bg-[#1E3A8A] text-white text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-transform active:scale-95"
          >
            <span>Submit Official DRHP Draft</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}