'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Lock, PenTool, Bot, CheckCircle2 } from 'lucide-react';
import HighlighterField from '../UI/HighlighterField';
import SignatureUploadRow from '../UI/SignatureUploadRow';
import { WizardFormData, PAPER_INPUT } from './wizardTypes';
import { useGeneratedDocuments } from '@/context/GeneratedDocumentsContext';

type ReviewState = 'idle' | 'reviewing' | 'ready';

const REVIEW_DURATION_SECONDS = 120; // 2 minutes

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTodayLabel(): string {
  const d = new Date();
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';
  return `${month} ${day}${suffix}, ${year}`;
}

interface PanelEightProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  onNavigateToGenerated?: () => void;
}

export default function PanelEight_FinalReview({ data, update, onNavigateToGenerated }: PanelEightProps) {
  const [signatureFile, setSignatureFile] = useState<string | null>(null);
  const [reviewState, setReviewState] = useState<ReviewState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(REVIEW_DURATION_SECONDS);

  const { addDocument } = useGeneratedDocuments();

  const handleSignatureUpload = (fileName: string) => {
    setSignatureFile(fileName);
    update('signatureVerified', true);
  };

  const handleSignatureDelete = () => {
    setSignatureFile(null);
    update('signatureVerified', false);
    // Signature was retracted — reset any in-progress AI review.
    setReviewState('idle');
    setSecondsLeft(REVIEW_DURATION_SECONDS);
  };

  const handleStartAiReview = () => {
    setReviewState('reviewing');
    setSecondsLeft(REVIEW_DURATION_SECONDS);
  };

  const handleGoToGenerated = () => {
    const today = formatTodayLabel();

    addDocument({
      name: 'DRHP.pdf',
      type: 'pdf',
      version: 'v2.2',
      dateGenerated: today,
      status: 'Final',
      url: '/pdfs/prospectus/DRHP.pdf',
    });

    addDocument({
      name: 'Abridged drhp.pdf',
      type: 'pdf',
      version: 'v1.5',
      dateGenerated: today,
      status: 'Final',
      url: '/pdfs/prospectus/Abridged-DRHP.pdf',
    });

    onNavigateToGenerated?.();
  };

  // Countdown ticker for the "reviewing" state.
  useEffect(() => {
    if (reviewState !== 'reviewing') {
      return;
    }

    if (secondsLeft <= 0) {
      setReviewState('ready');
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [reviewState, secondsLeft]);

  const progressPercent =
    ((REVIEW_DURATION_SECONDS - secondsLeft) / REVIEW_DURATION_SECONDS) * 100;

  return (
    <div className="paper-sheet-section space-y-9">
      <style jsx>{`
        @keyframes robot-dance {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          25% { transform: translateY(-4px) rotate(6deg); }
          50% { transform: translateY(0) rotate(-4deg); }
          75% { transform: translateY(-3px) rotate(8deg); }
        }
        .animate-robot-dance {
          animation: robot-dance 0.9s ease-in-out infinite;
        }
      `}</style>

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

          <SignatureUploadRow
            title="Signature Scan / DSC Token"
            subtext="PNG, JPG, PDF"
            fileName={signatureFile}
            onUpload={handleSignatureUpload}
            onDelete={handleSignatureDelete}
          />

          {signatureFile && (
            <div className="flex items-center gap-2 mt-4 px-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Signature Authenticated
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          BOTTOM ACTION AREA — AI REVIEW FLOW
      ========================================================= */}
      <div
        className={`p-8 border flex flex-col items-center text-center ${
          !signatureFile
            ? 'bg-slate-100 border-slate-300 opacity-50'
            : 'bg-white border-[#1E3A8A]'
        }`}
      >
        {!signatureFile && (
          <>
            <Lock className="w-6 h-6 text-slate-400 mb-2" />
            <span className="text-xs font-black text-slate-500 uppercase">
              Sign Document to Unlock Final Submission
            </span>
          </>
        )}

        {signatureFile && reviewState === 'idle' && (
          <button
            onClick={handleStartAiReview}
            className="px-8 py-4 bg-[#1E3A8A] text-white text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-transform active:scale-95"
          >
            <Bot className="w-5 h-5 animate-robot-dance" />
            <span>AI Generated DRHP Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {signatureFile && reviewState === 'reviewing' && (
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-[#1E3A8A]/30 bg-blue-50/60 rounded-lg">
              <Bot className="w-8 h-8 text-[#1E3A8A] animate-robot-dance" />

              <span className="text-sm font-black text-[#1E3A8A] uppercase tracking-wide">
                Reviewing your answers and documents…
              </span>

              <p className="text-[11px] font-semibold text-slate-500">
                This usually takes a couple of minutes. Please don&apos;t close this tab.
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#1E3A8A] transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Time remaining: {formatTime(secondsLeft)}
              </span>
            </div>
          </div>
        )}

        {signatureFile && reviewState === 'ready' && (
          <button
            onClick={handleGoToGenerated}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Go to Generated Documents</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
