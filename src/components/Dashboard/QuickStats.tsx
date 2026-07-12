'use client';

import { useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { mockDashboardStats } from '@/data/mockData';

export default function QuickStats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.stat-card');
    if (!cards) return;

    // Fade up + scale animation for cards on render
    gsap.fromTo(cards,
      { opacity: 0, y: 30, scale: 0.96 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        stagger: 0.1, 
        duration: 0.7, 
        ease: 'power3.out' 
      }
    );

    // Number counter-up animations
    cards.forEach((card) => {
      const counterEl = card.querySelector('.counter-value');
      if (!counterEl) return;

      const targetVal = parseFloat(counterEl.getAttribute('data-target') || '0');
      const countObj = { value: 0 };

      gsap.to(countObj, {
        value: targetVal,
        duration: 2,
        ease: 'power2.out',
        delay: 0.25,
        onUpdate: () => {
          if (counterEl) {
            counterEl.textContent = Math.round(countObj.value).toLocaleString();
          }
        }
      });

      // Progress bar slide animations
      const progressBar = card.querySelector('.progress-bar-fill') as HTMLElement;
      if (progressBar) {
        const targetWidth = progressBar.getAttribute('data-width') || '0%';
        gsap.fromTo(progressBar,
          { width: '0%' },
          { 
            width: targetWidth, 
            duration: 1.5, 
            ease: 'power2.out', 
            delay: 0.4 
          }
        );
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none w-full">
      {mockDashboardStats.quickStats.map((stat) => {
        // Resolve Lucide Icon dynamically
        const IconComponent = (Icons as any)[stat.icon] || Icons.HelpCircle;

        // Custom styling based on mock color tag
        let colorClasses = {
          bg: 'bg-primary-subtle text-primary',
          bar: 'bg-primary',
          border: 'hover:border-primary-light/50',
          shadow: 'shadow-primary/5'
        };

        if (stat.color === 'emerald') {
          colorClasses = {
            bg: 'bg-success-subtle text-success',
            bar: 'bg-success',
            border: 'hover:border-success-light/50',
            shadow: 'shadow-success/5'
          };
        } else if (stat.color === 'purple') {
          colorClasses = {
            bg: 'bg-purple/10 text-purple',
            bar: 'bg-purple',
            border: 'hover:border-purple/50',
            shadow: 'shadow-purple/5'
          };
        } else if (stat.color === 'amber') {
          colorClasses = {
            bg: 'bg-warning/10 text-warning',
            bar: 'bg-warning',
            border: 'hover:border-warning/50',
            shadow: 'shadow-warning/5'
          };
        }

        const isPercentage = stat.unit === '%';
        const isProgress = stat.total !== undefined;

        return (
          <div
            key={stat.id}
            className={`stat-card bg-white rounded-2xl p-6 border border-slate-200 shadow-default transition-all duration-350 hover:shadow-xl hover:-translate-y-1.5 clickable-card ${colorClasses.border}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <div className="flex items-baseline mt-3 gap-1">
                  <span
                    className="text-3xl font-extrabold text-slate-800 counter-value"
                    data-target={stat.value}
                  >
                    0
                  </span>
                  {isPercentage && <span className="text-xl font-bold text-slate-600">%</span>}
                  {stat.unit === 'days' && <span className="text-sm font-semibold text-slate-500 ml-1">days</span>}
                  {isProgress && (
                    <span className="text-sm text-slate-400 font-bold ml-1">
                      / {stat.total} {stat.unit}
                    </span>
                  )}
                </div>
              </div>
              <div className={`p-3.5 rounded-xl ${colorClasses.bg} shrink-0`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>

            {/* Optional Progress Bar */}
            {(isPercentage || isProgress) && (
              <div className="mt-5">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full progress-bar-fill relative shimmer-bg ${colorClasses.bar}`}
                    data-width={`${isPercentage ? stat.value : (stat.value / (stat.total || 1)) * 105}%`}
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            )}

            {/* Description and Change indicator */}
            <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold text-slate-500">
              <span className={`flex items-center font-bold ${stat.change >= 0 ? 'text-success' : 'text-error'}`}>
                {stat.change >= 0 ? '+' : ''}{stat.change}{isPercentage ? '%' : ''}
              </span>
              <span className="text-slate-400 font-medium">{stat.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
