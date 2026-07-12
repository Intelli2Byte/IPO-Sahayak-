'use client';

import { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { mockIpoApplication, UseOfProceedsItem } from '@/data/mockData';

interface StepFiveFormProps {
  onStepComplete: (updatedProceeds: UseOfProceedsItem[]) => void;
}

export default function StepFiveForm({ onStepComplete }: StepFiveFormProps) {
  const [allocations, setAllocations] = useState<UseOfProceedsItem[]>(
    mockIpoApplication.ipoDetails.useOfProceeds
  );
  
  const totalIssueSize = mockIpoApplication.ipoDetails.totalIssueSize; // 20,000,000
  const [currentSum, setCurrentSum] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Premium pastels for donut chart
  const COLORS = ['#004b93', '#10b981', '#8b5cf6', '#f59e0b'];

  useEffect(() => {
    const sum = allocations.reduce((acc, curr) => acc + curr.amount, 0);
    setCurrentSum(sum);
    
    if (sum !== totalIssueSize) {
      setErrorMsg(`Allocated sum (₹${sum.toLocaleString('en-IN')}) does not match Total Issue Size (₹${totalIssueSize.toLocaleString('en-IN')})`);
    } else {
      setErrorMsg(null);
    }
  }, [allocations, totalIssueSize]);

  const handleAmountChange = (index: number, valStr: string) => {
    const cleanVal = parseInt(valStr.replace(/[^0-9]/g, '')) || 0;
    
    setAllocations(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        amount: cleanVal,
        percentage: Math.round((cleanVal / totalIssueSize) * 100)
      };
      return updated;
    });
  };

  const handleReset = () => {
    setAllocations(mockIpoApplication.ipoDetails.useOfProceeds);
    setErrorMsg(null);
    setSuccessMsg(null);
    gsap.fromTo('.allocation-input', 
      { scale: 0.98, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSum !== totalIssueSize) {
      const form = formRef.current;
      if (form) {
        const tl = gsap.timeline();
        tl.to(form, { x: -8, duration: 0.06 })
          .to(form, { x: 8, duration: 0.06 })
          .to(form, { x: -8, duration: 0.06 })
          .to(form, { x: 8, duration: 0.06 })
          .to(form, { x: 0, duration: 0.06 });
      }

      gsap.fromTo('.allocation-input', 
        { borderColor: '#e2e8f0' },
        { borderColor: '#ef4444', duration: 0.2, yoyo: true, repeat: 1 }
      );

      if (errorRef.current) {
        gsap.fromTo(errorRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
      return;
    }

    setSuccessMsg('Use of Funds allocations validated and saved successfully!');

    if (successRef.current) {
      gsap.fromTo(successRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }

    setTimeout(() => {
      onStepComplete(allocations);
    }, 1000);
  };

  const chartData = allocations.map((item, idx) => ({
    name: item.purpose,
    value: item.amount,
    percentage: item.percentage,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none">
      
      {/* LEFT: Airy Proceeds Allocation Inputs Form */}
      <div className="lg:col-span-7 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Proceeds Allocation</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Distribute total proceeds: <span className="text-primary font-bold">₹{totalIssueSize.toLocaleString('en-IN')}</span>
            </p>
          </div>
          <button 
            type="button" 
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-slate-200 font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {allocations.map((item, index) => (
              <div key={item.purpose} className="space-y-2 border-b border-slate-50/50 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.purpose}</label>
                  <span className="text-xs font-extrabold text-primary bg-primary-subtle/40 px-2 py-0.5 rounded-md">{item.percentage}%</span>
                </div>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-sm font-extrabold text-slate-400">₹</span>
                  </div>
                  <input
                    type="text"
                    value={item.amount.toLocaleString('en-IN')}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    className="allocation-input block w-full pl-8 pr-12 py-3 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-slate-50/40 hover:bg-slate-50 font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Validation Alert */}
          {errorMsg && (
            <div ref={errorRef} className="p-3.5 bg-red/5 border border-red/10 rounded-xl flex items-start gap-2.5 text-xs text-error font-semibold">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div ref={successRef} className="p-3.5 bg-success-subtle border border-success-light/20 rounded-xl flex items-start gap-2.5 text-xs text-success font-semibold">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Net balance banner */}
          <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
            <div>
              <p className="text-slate-450 font-bold uppercase tracking-wider">Allocated Balance</p>
              <p className={`text-base font-extrabold mt-1.5 ${currentSum === totalIssueSize ? 'text-success' : 'text-warning'}`}>
                ₹{currentSum.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-455 font-bold uppercase tracking-wider">Required Target</p>
              <p className="text-base font-extrabold text-slate-800 mt-1.5">₹{totalIssueSize.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-primary/20 transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            Validate & Save proceeds
          </button>
        </form>
      </div>

      {/* RIGHT: Visual Donut Chart Card */}
      <div className="lg:col-span-5 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <h3 className="text-base font-bold text-slate-800">Allocation Distribution</h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Proportional display of proceed allocation percentages</p>
        </div>
        
        {/* Interactive Donut Chart Container */}
        <div className="h-60 w-full flex items-center justify-center mt-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => `₹${value.toLocaleString('en-IN')}`} 
                contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12, fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Total Issue</span>
            <span className="text-base font-black text-slate-800 mt-1">₹{(totalIssueSize / 10000000).toFixed(2)} Cr</span>
          </div>
        </div>

        {/* Legend listing with proportional progress segments */}
        <div className="space-y-4 mt-6 pt-4 border-t border-slate-100">
          {chartData.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-650 truncate max-w-[170px]">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-800">
                  ₹{(item.value / 100000).toFixed(1)} L ({item.percentage}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
