'use client';

import { useMemo, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import PaperStamp from '../ui/PaperStamp';
import { WizardFormData, DEFAULT_WIZARD_DATA } from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

const COLORS = ['#1d3a8a', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9'];

export default function PanelFive_UseOfFundsLedger({ data, update }: PanelProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const totalIssueSize = data.totalIssueSize;
  const currentSum = data.fundingAllocations.reduce((acc, item) => acc + item.amount, 0);
  const isBalanced = currentSum === totalIssueSize;

  const handleAmountChange = (index: number, valStr: string) => {
    const cleanVal = parseInt(valStr.replace(/[^0-9]/g, '')) || 0;
    const updated = [...data.fundingAllocations];
    updated[index] = { ...updated[index], amount: cleanVal, percentage: Math.round((cleanVal / totalIssueSize) * 100) };
    update('fundingAllocations', updated);
  };

  const handleReset = () => {
    update('fundingAllocations', DEFAULT_WIZARD_DATA.fundingAllocations);
    if (formRef.current) {
      gsap.fromTo(formRef.current.querySelectorAll('.allocation-input'), { scale: 0.98, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out' });
    }
  };

  const shake = () => {
    if (!formRef.current) return;
    const tl = gsap.timeline();
    tl.to(formRef.current, { x: -8, duration: 0.06 })
      .to(formRef.current, { x: 8, duration: 0.06 })
      .to(formRef.current, { x: -8, duration: 0.06 })
      .to(formRef.current, { x: 8, duration: 0.06 })
      .to(formRef.current, { x: 0, duration: 0.06 });
  };

  const chartData = useMemo(
    () => data.fundingAllocations.map((item, idx) => ({ name: item.purpose, value: item.amount, percentage: item.percentage, color: COLORS[idx % COLORS.length] })),
    [data.fundingAllocations]
  );

  return (
    <div className="paper-sheet-section space-y-9">
      <div className="doc-section-header">
        <span className="doc-section-eyebrow">Section V</span>
        <h3 className="doc-section-title">Use of Funds Allocation Ledger</h3>
        <p className="doc-section-sub">
          Distribute the total issue proceeds across purposes. The ledger must balance to exactly 100% before you can proceed —
          this mirrors how a physical accounting ledger is reconciled line by line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ledger inputs */}
        <div ref={formRef} className="lg:col-span-7 relative">
          {!isBalanced && <PaperStamp visible text="LEDGER UNBALANCED" subtext="Does not total 100%" variant="error" position="top-right" />}
          {isBalanced && <PaperStamp visible text="LEDGER BALANCED" subtext="Totals exactly 100%" variant="success" position="top-right" />}

          <div className="flex justify-between items-start mb-5">
            <p className="text-xs text-slate-500 font-semibold">
              Total to distribute: <span className="text-primary font-bold">₹{totalIssueSize.toLocaleString('en-IN')}</span>
            </p>
            <button type="button" onClick={handleReset} className="push-tab-outline flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-5">
            {data.fundingAllocations.map((item, index) => (
              <div key={item.purpose} className="space-y-2 border-b border-slate-200/70 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{item.purpose}</label>
                  <span className="ink-counter">{item.percentage}%</span>
                </div>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-sm font-extrabold text-slate-400">₹</span>
                  </div>
                  <input
                    type="text"
                    value={item.amount.toLocaleString('en-IN')}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    className="allocation-input block w-full pl-8 pr-4 py-3 text-sm border border-slate-300 rounded-md focus:border-primary bg-[#fffdf8] transition-all font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {!isBalanced && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-red-700 font-semibold mt-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Allocated sum (₹{currentSum.toLocaleString('en-IN')}) does not match total issue size (₹{totalIssueSize.toLocaleString('en-IN')}).</span>
            </div>
          )}
          {isBalanced && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-start gap-2.5 text-xs text-emerald-700 font-semibold mt-5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Use of Funds ledger reconciles correctly. You may proceed.</span>
            </div>
          )}

          <div className="ledger-summary mt-5">
            <div>
              <span className="ledger-label">Allocated Balance</span>
              <span className={`ledger-value ${isBalanced ? 'text-emerald-700' : 'text-amber-700'}`}>₹{currentSum.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="ledger-label">Required Target</span>
              <span className="ledger-value">₹{totalIssueSize.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <p className="text-xs text-slate-500 font-semibold mb-2">Proportional distribution of allocated funds</p>
          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={62} outerRadius={82} paddingAngle={4} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString('en-IN')}`} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Total Issue</span>
              <span className="text-base font-black text-slate-800 mt-1">₹{(totalIssueSize / 10000000).toFixed(2)} Cr</span>
            </div>
          </div>
          <div className="space-y-3.5 mt-4 pt-4 border-t border-slate-200/70">
            {chartData.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-650 truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-800">₹{(item.value / 100000).toFixed(1)} L ({item.percentage}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function useOfFundsIsBalanced(data: WizardFormData) {
  const sum = data.fundingAllocations.reduce((acc, item) => acc + item.amount, 0);
  return sum === data.totalIssueSize;
}