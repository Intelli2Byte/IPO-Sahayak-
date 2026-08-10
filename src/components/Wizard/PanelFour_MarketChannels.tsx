'use client';

import { useRef, useState, DragEvent } from 'react';
import {
  UploadCloud,
  FileCheck2,
  Loader2,
  Lock,
  Building2,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';

import HighlighterField from '../UI/HighlighterField';
import {
  WizardFormData,
  MarketChannel,
  KeyPartner,
  UploadedFileMeta,
  PAPER_INPUT,
  PAPER_TEXTAREA,
  PAPER_SELECT,
  INDIAN_STATES,
} from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

// Mocked AI-extraction results — in production this comes from the
// contract-parsing backend, keyed off marketChannelsContractDoc.
const MOCK_ACTIVE_CHANNEL_LABELS = [
  'Direct Institutional Sales (B2B/B2G)',
  'Channel Partners / Authorized Distributors',
  'Digital / E-commerce Storefront',
];

const MOCK_EXTRACTED_PARTNERS: KeyPartner[] = [
  { id: 'partner-1', name: 'Reliance Retail Limited', icon: 'company', locked: true },
  { id: 'partner-2', name: 'MyJio App Ecosystem', icon: 'app', locked: true },
  { id: 'partner-3', name: 'JioBusiness Enterprise', icon: 'company', locked: true },
];

const MOCK_AI_NARRATIVE =
  'The Company employs an omni-channel distribution strategy. Retail sales are primarily executed through a Master Distribution Agreement with Reliance Retail Limited, supplemented by direct institutional partnerships and a growing digital storefront presence via the MyJio App Ecosystem.';

export default function PanelFour_MarketChannels({ data, update, errors }: PanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const toggleChannel = (idx: number) => {
    const updated: MarketChannel[] = [...data.marketChannels];
    updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
    update('marketChannels', updated);
  };

  const runAiExtraction = () => {
    setIsExtracting(true);

    window.setTimeout(() => {
      const updatedChannels = data.marketChannels.map((c) => ({
        ...c,
        checked: MOCK_ACTIVE_CHANNEL_LABELS.includes(c.label) ? true : c.checked,
      }));

      update('marketChannels', updatedChannels);
      update('keyPartners', MOCK_EXTRACTED_PARTNERS);
      update('aiDraftedNarrative', MOCK_AI_NARRATIVE);

      setIsExtracting(false);
    }, 1200);
  };

  const ingestFile = (file: File | undefined | null) => {
    if (!file) return;

    const meta: UploadedFileMeta = {
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    update('marketChannelsContractDoc', meta);
    runAiExtraction();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    ingestFile(e.dataTransfer.files?.[0]);
  };

  const toggleGeography = (state: string) => {
    const exists = data.targetGeographies.includes(state);
    const next = exists
      ? data.targetGeographies.filter((s) => s !== state)
      : [...data.targetGeographies, state];
    update('targetGeographies', next);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  };

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow font-display">Section IV</span>
        <h3 className="doc-section-title font-display">Market &amp; Monetization Channels</h3>
        <p className="doc-section-sub font-sans">
          Upload your master distribution agreements — the AI will instantly map your revenue
          channels. Complete the manual questions to finish this section.
        </p>
      </div>

      {/* 4.1 — CONTRACT INGESTION */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 font-display">
          4.1 — Contract Ingestion{' '}
          <span className="text-slate-400 font-semibold normal-case">(new upload only)</span>
        </h4>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => ingestFile(e.target.files?.[0])}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg py-10 px-6 cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#1E3A8A] bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-6 h-6 text-[#1E3A8A] animate-spin" />
              <p className="text-xs font-bold text-slate-700 font-sans">
                Analyzing contract &amp; mapping revenue channels…
              </p>
            </>
          ) : data.marketChannelsContractDoc ? (
            <>
              <FileCheck2 className="w-6 h-6 text-emerald-600" />
              <p className="text-xs font-bold text-slate-800 font-sans">
                {data.marketChannelsContractDoc.name}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {formatBytes(data.marketChannelsContractDoc.size)} — click or drop to replace
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="w-6 h-6 text-slate-400" />
              <p className="text-xs font-bold text-slate-700 font-sans">
                Drop &apos;Master Distribution &amp; Commercial Agreements.pdf&apos; here
              </p>
              <p className="text-[10px] text-slate-400 font-sans">or click to browse</p>
            </>
          )}
        </div>
      </div>

      {/* SPLIT: AUTO-EXTRACTION (LEFT) | MANUAL QUESTIONNAIRE (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
        {/* LEFT — INSTANT AUTO-EXTRACTION */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1E3A8A] font-display">
              Instant Auto-Extraction
            </h4>
          </div>

          {/* 4.2 — MONETIZATION CHANNELS (unchanged design) */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-1 font-sans">
              4.2 — Monetization Channels
            </p>
            <p className="text-[10px] text-slate-500 mb-4 font-sans">
              The AI pre-toggles active channels based on the uploaded contract. Verify and adjust
              if necessary.
            </p>

            <div className="flex flex-col gap-3">
              {data.marketChannels.map((channel, idx) => (
                <div
                  key={channel.label}
                  onClick={() => toggleChannel(idx)}
                  className={`relative flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all overflow-hidden ${
                    channel.checked
                      ? 'border-[#1E3A8A] bg-blue-50'
                      : 'border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] font-black text-slate-400 w-6 shrink-0 font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-800 z-10 font-sans">
                    {channel.label}
                  </span>

                  {/* absolutely positioned signature-line indicator */}
                  <div className="absolute inset-0 z-0 pointer-events-none opacity-80 flex items-center justify-end pr-4">
                    <svg viewBox="0 0 100 24" className="w-24 h-6" preserveAspectRatio="none">
                      <path
                        d="M2,12 C 20,4 40,20 60,10 S 90,4 98,12"
                        fill="none"
                        stroke="#1E3A8A"
                        strokeWidth="4"
                        strokeLinecap="round"
                        pathLength={100}
                        style={{
                          strokeDasharray: 100,
                          strokeDashoffset: channel.checked ? 0 : 100,
                          transition: 'stroke-dashoffset 0.35s ease-out',
                        }}
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {errors.channels && (
              <p className="text-[10px] font-bold text-red-600 mt-2 font-sans">
                {errors.channels}
              </p>
            )}
          </div>

          {/* 4.3 — KEY IDENTIFIED PARTNERS */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-3 font-sans">
              4.3 — Key Identified Partners
            </p>

            {data.keyPartners.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-5 text-center">
                <p className="text-[10px] text-slate-400 font-sans">
                  Partners will appear here once a contract is analyzed.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {data.keyPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {partner.icon === 'app' ? (
                        <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-slate-800 font-sans">
                        {partner.name}
                      </span>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4.4 — AI-DRAFTED NARRATIVE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-bold text-slate-700 font-sans">
                4.4 — AI-Drafted Narrative
              </p>
              {data.aiDraftedNarrative && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-[#1E3A8A] bg-blue-100 px-2 py-0.5 rounded-full font-display">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Drafted
                </span>
              )}
            </div>

            <textarea
              rows={6}
              value={data.aiDraftedNarrative}
              onChange={(e) => update('aiDraftedNarrative', e.target.value)}
              placeholder="This narrative will be drafted automatically once a distribution agreement is analyzed. You may edit it after generation."
              className={`${PAPER_TEXTAREA} font-sans`}
            />
          </div>
        </div>

        {/* RIGHT — MANUAL QUESTIONNAIRE */}
        <div className="space-y-8 md:border-l md:border-slate-200 md:pl-8">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-display">
            Manual Questionnaire
          </h4>

          {/* 4.5 — TARGET GEOGRAPHIES */}
          <HighlighterField label="4.5 — Target Geographies (>10% of sales volume)" required>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) toggleGeography(e.target.value);
              }}
              className={`${PAPER_SELECT} font-sans`}
            >
              <option value="">+ Add a state…</option>
              {INDIAN_STATES.filter((s) => !data.targetGeographies.includes(s)).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {data.targetGeographies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.targetGeographies.map((state) => (
                  <span
                    key={state}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1E3A8A] bg-blue-50 border border-blue-200 rounded-full px-3 py-1 font-sans"
                  >
                    {state}
                    <button
                      type="button"
                      onClick={() => toggleGeography(state)}
                      className="text-[#1E3A8A]/60 hover:text-[#1E3A8A]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {errors.targetGeographies && (
              <p className="text-[10px] font-bold text-red-600 mt-2 font-sans">
                {errors.targetGeographies}
              </p>
            )}
          </HighlighterField>

          {/* 4.6 — REVENUE DEPENDENCY */}
          <HighlighterField label="4.6 — Revenue Dependency (Top 5 clients/distributors)" required>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={data.revenueDependencyTop5 || ''}
                onChange={(e) => update('revenueDependencyTop5', Number(e.target.value))}
                placeholder="45.50"
                className={`${PAPER_INPUT} font-mono pr-8`}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 font-mono">
                %
              </span>
            </div>

            {errors.revenueDependencyTop5 && (
              <p className="text-[10px] font-bold text-red-600 mt-2 font-sans">
                {errors.revenueDependencyTop5}
              </p>
            )}
          </HighlighterField>

          {/* 4.7 — CUSTOMER ACQUISITION */}
          <HighlighterField label="4.7 — Customer Acquisition Strategy" required>
            <textarea
              rows={6}
              value={data.customerAcquisitionStrategy}
              onChange={(e) => update('customerAcquisitionStrategy', e.target.value)}
              placeholder="Describe your primary marketing and customer acquisition strategy."
              className={`${PAPER_TEXTAREA} font-sans`}
            />

            {errors.customerAcquisitionStrategy && (
              <p className="text-[10px] font-bold text-red-600 mt-2 font-sans">
                {errors.customerAcquisitionStrategy}
              </p>
            )}
          </HighlighterField>
        </div>
      </div>
    </div>
  );
}
