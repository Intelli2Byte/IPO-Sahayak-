'use client';

import HighlighterField from '../ui/HighlighterField';
import { WizardFormData, MarketChannel, PAPER_SELECT } from './wizardTypes';

export default function PanelFour_MarketChannels({ data, update }: any) {
  const toggleChannel = (idx: number) => {
    const updated: MarketChannel[] = [...data.marketChannels];
    updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
    update('marketChannels', updated);
  };

  const checkedCount = data.marketChannels.filter((c: any) => c.checked).length;

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Section IV</span>
        <h3 className="doc-section-title">Market &amp; Monetization Channels</h3>
        <p className="doc-section-sub">
          Mark every channel through which the company currently generates or plans to generate revenue.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {data.marketChannels.map((channel: any, idx: number) => (
          <div
            key={channel.label}
            onClick={() => toggleChannel(idx)}
            className={`relative flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all overflow-hidden ${
              channel.checked ? 'border-[#1E3A8A] bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="text-[10px] font-black text-slate-400 w-6 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
            <span className="text-xs font-bold text-slate-800 z-10">{channel.label}</span>
            
            {/* FIX: The SVG is now absolutely positioned inside the relative row */}
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
    </div>
  );
}