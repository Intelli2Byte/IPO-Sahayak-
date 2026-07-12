'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck, 
  Key,
  UploadCloud,
  RefreshCw,
  Briefcase,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import gsap from 'gsap';
import { mockIpoApplication } from '@/data/mockData';
import StepFiveForm from './StepFiveForm';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 
  'Lakshadweep', 'Puducherry'
];

interface Promoter {
  name: string;
  type: string;
  pan: string;
  din: string;
  experience: number;
  background: string;
  shareholding: number;
  mobile: string;
  email: string;
  address: string;
}

interface ProductItem {
  name: string;
  description: string;
  revenueContribution: number;
  category: string;
}

export default function StepWizard() {
  // Set default active step to 1 as requested
  const [activeStep, setActiveStep] = useState<number>(1);
  const [overallProgress, setOverallProgress] = useState(67);
  const wizardContainerRef = useRef<HTMLDivElement>(null);
  
  // CIN Fetch verification states
  const [cinStatus, setCinStatus] = useState<'idle' | 'verifying' | 'verified'>('verified');
  const [cinError, setCinError] = useState<string | null>(null);

  // Initial Form Data State matching all specifications
  const [formData, setFormData] = useState({
    // Step 1: Corporate Identity & Address
    cin: 'U51909TG2019PLC133166',
    companyName: 'Neha Fashion Private Limited',
    addressBuilding: 'Plot No. 42, Hitech City',
    addressStreet: 'Phase 2, Madhapur',
    addressLocality: 'Madhapur Industrial Area',
    addressCity: 'Hyderabad',
    addressDistrict: 'Hyderabad',
    addressState: 'Telangana',
    addressPinCode: '500081',
    
    // Step 1: Contact details
    telephone: '+91-40-4929342',
    officialEmail: 'compliance@nehafashion.com',
    websiteUrl: 'https://www.nehafashion.com',

    // Step 1: Promoters list
    promoterCount: 2,
    promoters: [
      {
        name: 'Rajesh Kumar',
        type: 'Individual Person',
        pan: 'ABJPK4921F',
        din: '08492311',
        experience: 24,
        background: 'Mr. Rajesh Kumar holds a Bachelor\'s degree in Textile Technology. He has 24 years of experience in textile manufacturing and apparel distribution, leading large scale organic textile ventures across South India.',
        shareholding: 60.0,
        mobile: '+91-9876543210',
        email: 'rajesh.kumar@nehafashion.com',
        address: 'Flat 401, TMC House, Hitech City, Hyderabad, 500081'
      },
      {
        name: 'Neha Kumar',
        type: 'Individual Person',
        pan: 'ABJPK9024D',
        din: '09024823',
        experience: 18,
        background: 'Mrs. Neha Kumar holds a Master\'s in Fashion Designing. She has over 18 years of experience in clothing retail and brand management, pioneering sustainable eco-apparel lines.',
        shareholding: 40.0,
        mobile: '+91-9876543211',
        email: 'neha.kumar@nehafashion.com',
        address: 'Flat 402, TMC House, Hitech City, Hyderabad, 500081'
      }
    ] as Promoter[],

    // Step 1: Company Secretary
    csName: 'Khushali Patel',
    csIcsiNumber: 'ACS49218',
    csEmail: 'cs@nehafashion.com',
    csPhone: '+91-40-4929343',
    csMobile: '+91-9876543212',

    // Step 1: Document Upload States (simulated)
    docCertIncorporation: true,
    docMoa: true,
    docAoa: true,
    docPromoterResumes: true,
    docPanCards: true,
    docAddressProof: true,

    // Step 2: Business & Operations Overview
    businessModel: 'Neha Fashion Private Limited is engaged in the business of designing, manufacturing, and supplying premium organic clothing. Our products range from oil-spun linen garments to zero-discharge dyed cotton apparels. We primarily serve premium retail franchises, eco-friendly boutiques, and select direct-to-consumer digital channels. Our business model is B2B, with recurring orders from leading national clothing networks.',
    usp: 'Eco-friendly organic linen textiles with zero-discharge manufacturing footprint.',
    
    // Dynamic products array
    products: [
      { name: 'Organic Linen Garments', description: 'Certified organic cotton apparel suitable for multi-season retail networks.', revenueContribution: 65, category: 'Manufactured Product' },
      { name: 'Zero-Discharge Dyed Cotton', description: 'Premium dye garments conforming to eco-safety standards.', revenueContribution: 35, category: 'Manufactured Product' }
    ] as ProductItem[],

    // Industries served
    sectorsServed: ['Railways & Metro Rail', 'Renewable Energy (Solar, Wind)', 'Industrial Manufacturing'],
    sectorBreakdowns: {
      'Railways & Metro Rail': { revenue: 25000, customers: 'Indian Railways, Delhi Metro' },
      'Renewable Energy (Solar, Wind)': { revenue: 10000, customers: 'Solar EPC companies' },
      'Industrial Manufacturing': { revenue: 6000, customers: 'Various industrial clients' }
    } as Record<string, { revenue: number, customers: string }>,

    // Installed capacity
    capacityValue: 8500,
    capacityUnit: 'Units per month',
    capacityUtilization: 71,

    // Step 3: Financial variables
    fy24Revenue: 34.50,
    fy25Revenue: 42.10,
    fy26Revenue: 58.40,
    fy24Pat: 2.80,
    fy25Pat: 3.90,
    fy26Pat: 5.60,
    totalAssets: 45.20,
    netWorth: 28.50,
    totalDebt: 8.40,

    risk1Title: 'Raw material price volatility',
    risk1Description: 'Fluctuations in organic cotton index directly impact margins.',
    risk2Title: 'Geographic concentration',
    risk2Description: '75% of operations are currently in Southern Indian states.',
    risk3Title: 'Technology migration',
    risk3Description: 'Upgrading retail machinery might face temporary downtime.',
    risk4Title: 'Currency fluctuations',
    risk4Description: 'Export raw material pricing affected by USD exchange rates.',
    risk5Title: 'Talent attrition',
    risk5Description: 'Shortage of skilled designers in Hitech region.',

    litigationsCount: 1,
    taxDisputesCount: 0,
    complianceCheck1: true,
    complianceCheck2: true,
    complianceCheck3: true,

    signatory: 'Rajesh Kumar',
    dscUploaded: false,
    declarationAccepted: false
  });

  const stepsList = [
    { stepNumber: 1, name: 'Company Info', icon: Building2 },
    { stepNumber: 2, name: 'Business Overview', icon: Briefcase },
    { stepNumber: 3, name: 'Financials', icon: DollarSign },
    { stepNumber: 4, name: 'Business Model', icon: FileText },
    { stepNumber: 5, name: 'Use of Funds', icon: TrendingUp },
    { stepNumber: 6, name: 'Risk Factors', icon: ShieldAlert },
    { stepNumber: 7, name: 'Legal & Compliance', icon: FileCheck },
    { stepNumber: 8, name: 'Review & Submit', icon: Key }
  ];

  useEffect(() => {
    const headers = wizardContainerRef.current?.querySelectorAll('.step-header-card');
    if (headers && headers.length > 0) {
      gsap.fromTo(headers,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, []);

  // Scroll parent main container back to top when activeStep changes
  useEffect(() => {
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  const selectActiveStep = (stepNum: number) => {
    gsap.fromTo('.wizard-body-content',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
    setActiveStep(stepNum);
  };

  const handleInputChange = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  // State PIN Code Check mapping
  const validatePinCodeForState = (pin: string, state: string): boolean => {
    if (pin.length !== 6) return false;
    const firstDigit = pin[0];
    switch (state) {
      case 'Telangana':
      case 'Andhra Pradesh':
      case 'Karnataka':
        return firstDigit === '5';
      case 'Maharashtra':
      case 'Goa':
      case 'Madhya Pradesh':
      case 'Chhattisgarh':
        return firstDigit === '4';
      case 'Gujarat':
      case 'Rajasthan':
        return firstDigit === '3';
      case 'Tamil Nadu':
      case 'Kerala':
        return firstDigit === '6';
      case 'Delhi':
      case 'Haryana':
      case 'Punjab':
        return firstDigit === '1';
      case 'Uttar Pradesh':
      case 'Uttarakhand':
        return firstDigit === '2';
      default:
        return true; // simple bypass pass-through
    }
  };

  const handleCinVerify = () => {
    setCinStatus('verifying');
    setCinError(null);
    setTimeout(() => {
      const normalized = formData.cin.trim().toUpperCase();
      if (!normalized.startsWith('U') && !normalized.startsWith('L')) {
        setCinError('Invalid CIN format. Must start with U or L. Check your Certificate of Incorporation.');
        setCinStatus('idle');
        return;
      }
      if (normalized.length !== 21) {
        setCinError('Invalid CIN format. Must be exactly 21 characters.');
        setCinStatus('idle');
        return;
      }

      setCinStatus('verified');
      setFormData(prev => ({
        ...prev,
        companyName: 'Neha Fashion Private Limited',
        addressBuilding: 'Plot No. 42, Hitech City',
        addressStreet: 'Phase 2, Madhapur',
        addressLocality: 'Madhapur Industrial Area',
        addressCity: 'Hyderabad',
        addressDistrict: 'Hyderabad',
        addressState: 'Telangana',
        addressPinCode: '500081',
        telephone: '+91-40-4929342',
        officialEmail: 'compliance@nehafashion.com',
        websiteUrl: 'https://www.nehafashion.com',
        csName: 'Khushali Patel',
        csIcsiNumber: 'ACS49218',
        csEmail: 'cs@nehafashion.com',
        csPhone: '+91-40-4929343',
        csMobile: '+91-9876543212',
      }));
    }, 1200);
  };

  // Dynamic Promoter Adding Counter
  const handlePromoterCountChange = (count: number) => {
    if (count < 1 || count > 10) return;
    handleInputChange('promoterCount', count);
    
    setFormData(prev => {
      const currentPromoters = [...prev.promoters];
      if (count > currentPromoters.length) {
        for (let i = currentPromoters.length; i < count; i++) {
          currentPromoters.push({
            name: '',
            type: 'Individual Person',
            pan: '',
            din: '',
            experience: 0,
            background: '',
            shareholding: 0,
            mobile: '',
            email: '',
            address: ''
          });
        }
      } else if (count < currentPromoters.length) {
        currentPromoters.splice(count);
      }
      return { ...prev, promoters: currentPromoters };
    });
  };

  const handlePromoterFieldChange = (index: number, field: keyof Promoter, value: any) => {
    setFormData(prev => {
      const updated = [...prev.promoters];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, promoters: updated };
    });
  };

  // Promoter shareholding sum calculations
  const totalPromoterShares = formData.promoters.reduce((acc, p) => acc + (p.shareholding || 0), 0);
  const meetsPromoterMinimum = totalPromoterShares >= 20;

  // Step 2: Dynamic product entries
  const handleAddProduct = () => {
    if (formData.products.length >= 10) return;
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', description: '', revenueContribution: 0, category: 'Manufactured Product' }]
    }));
  };

  const handleRemoveProduct = (index: number) => {
    if (formData.products.length <= 2) return;
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, idx) => idx !== index)
    }));
  };

  const handleProductFieldChange = (index: number, field: keyof ProductItem, value: any) => {
    setFormData(prev => {
      const updated = [...prev.products];
      if (field === 'revenueContribution') {
        updated[index] = { ...updated[index], [field]: parseInt(value) || 0 };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, products: updated };
    });
  };

  const totalProductRevenue = formData.products.reduce((acc, p) => acc + (p.revenueContribution || 0), 0);

  // Dynamic Sector Revenue Breakdown handlers
  const handleSectorCheck = (sector: string) => {
    setFormData(prev => {
      const isChecked = prev.sectorsServed.includes(sector);
      let updatedSectors = [...prev.sectorsServed];
      let updatedBreakdowns = { ...prev.sectorBreakdowns };

      if (isChecked) {
        updatedSectors = updatedSectors.filter(s => s !== sector);
        delete updatedBreakdowns[sector];
      } else {
        updatedSectors.push(sector);
        updatedBreakdowns[sector] = { revenue: 0, customers: '' };
      }

      return {
        ...prev,
        sectorsServed: updatedSectors,
        sectorBreakdowns: updatedBreakdowns
      };
    });
  };

  const handleSectorBreakdownChange = (sector: string, field: 'revenue' | 'customers', value: any) => {
    setFormData(prev => {
      const updatedBreakdowns = { ...prev.sectorBreakdowns };
      if (field === 'revenue') {
        updatedBreakdowns[sector] = {
          ...updatedBreakdowns[sector],
          revenue: parseInt(value) || 0
        };
      } else {
        updatedBreakdowns[sector] = {
          ...updatedBreakdowns[sector],
          customers: value
        };
      }
      return { ...prev, sectorBreakdowns: updatedBreakdowns };
    });
  };

  const totalSectorRevenue = Object.values(formData.sectorBreakdowns).reduce((acc, sb) => acc + sb.revenue, 0);
  const maxSectorContribution = Object.values(formData.sectorBreakdowns).reduce((max, sb) => {
    const pct = totalSectorRevenue > 0 ? (sb.revenue / totalSectorRevenue) * 100 : 0;
    return pct > max ? pct : max;
  }, 0);

  // Business Model Warning checkers
  const hasPromoPhrases = /best in class|leading player|market leader|world class|finest/gi.test(formData.businessModel);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationAccepted) return;

    setOverallProgress(100);
    alert('Congratulations! Your DRHP Draft has been validated and submitted to your Lead Banker successfully.');
  };

  return (
    <div ref={wizardContainerRef} className="space-y-8 pb-12 select-none w-full max-w-7xl mx-auto px-1">
      
      {/* Premium Header Layout with Integrated Micro-Progress Ring */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-850 font-display tracking-tight">
            IPO Application Wizard
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Application: <span className="text-slate-850">{mockIpoApplication.applicationNumber}</span>
          </p>
        </div>

        {/* Circular Micro-Progress Badge */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm px-4.5 py-2.5 rounded-2xl shrink-0">
          <div className="relative w-10 h-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" className="stroke-slate-100" strokeWidth="3" fill="transparent" />
              <circle 
                cx="20" 
                cy="20" 
                r="16" 
                className="stroke-primary transition-all duration-700" 
                strokeWidth="3.5" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 16}`} 
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - overallProgress / 100)}`} 
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-850">{overallProgress}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Draft Status</span>
            <span className="text-xs font-extrabold text-slate-800">Compliance Drafting</span>
          </div>
        </div>
      </div>

      {/* Modern, Compact Stepper Indicator Strip */}
      <div className="bg-white border border-slate-100/80 p-6.5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative flex items-center justify-between w-full max-w-5xl mx-auto px-4 md:px-8">
          
          {/* Fine horizontal line connector */}
          <div className="absolute left-10 right-10 top-4.5 h-0.5 bg-slate-100 -z-0">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((activeStep - 1) / 7) * 100}%` }}
            />
          </div>

          {/* Minimalist Geometric Nodes */}
          {stepsList.map((step) => {
            const isCompleted = step.stepNumber < activeStep;
            const isActive = activeStep === step.stepNumber;
            const isFuture = step.stepNumber > activeStep;

            let circleClass = 'bg-slate-50 text-slate-400 border-slate-200';
            let textClass = 'text-slate-400 font-semibold opacity-70';

            if (isActive) {
              circleClass = 'bg-primary text-white border-primary ring-4 ring-primary/15 scale-105 shadow-sm';
              textClass = 'text-primary font-bold';
            } else if (isCompleted) {
              circleClass = 'bg-success text-white border-success shadow-success-subtle shadow-sm';
              textClass = 'text-success font-bold';
            }

            return (
              <div 
                key={step.stepNumber}
                onClick={() => selectActiveStep(step.stepNumber)}
                className="step-header-card flex flex-col items-center relative z-10 cursor-pointer group flex-1"
              >
                {/* Circle badge */}
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs transition-all duration-300 font-bold ${circleClass}`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{step.stepNumber}</span>
                  )}
                </div>

                {/* Subtitle Underneath */}
                <span className={`text-[10px] md:text-xs text-center mt-2.5 max-w-[80px] leading-tight block break-words transition-colors duration-300 ${textClass} group-hover:text-slate-800`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main active content screen */}
      <div className="wizard-body-content bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
        
        {/* Step 1: Corporate Identity & Promoter Basics */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">STEP 1: CORPORATE IDENTITY & PROMOTER BASICS</h3>
              <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                Let&apos;s start by establishing the foundational legal details of your company and the individuals driving it. This information will be used to auto-populate key sections of your DRHP.
              </p>
            </div>

            {/* Q1.1 Company CIN */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Q1.1: Company Corporate Identification Number (CIN) <span className="text-red font-bold">*</span></label>
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute left-5 bottom-5 hidden group-hover:block w-72 bg-slate-900 text-white text-[10px] p-3 rounded-lg shadow-xl z-50 leading-relaxed font-semibold">
                    Your CIN is a unique 21-character identifier issued by the Ministry of Corporate Affairs (MCA) at the time of company incorporation. You can find it on your Certificate of Incorporation.
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                Enter your 21-character Corporate Identity Number (CIN) exactly as it appears on your Certificate of Incorporation.<br />
                Format: U/L[5-digit NIC][State][Year][Type][Serial] · Example: <strong className="text-slate-700">U51909TG2019PLC133166</strong>
              </p>
              
              <div className="flex gap-3 max-w-xl">
                <input 
                  type="text" 
                  value={formData.cin} 
                  onChange={(e) => handleInputChange('cin', e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                  maxLength={21}
                  placeholder="e.g. U51909TG2019PLC133166"
                />
                <button 
                  type="button"
                  onClick={handleCinVerify}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {cinStatus === 'verifying' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Sync MCA Records</span>
                  )}
                </button>
              </div>
              {cinError && (
                <p className="text-[11px] text-red font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {cinError}
                </p>
              )}
              {cinStatus === 'verified' && (
                <span className="text-[11px] text-success font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-100/50 px-3 py-1 rounded-lg w-fit">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Real-time MCA API verification active
                </span>
              )}
            </div>

            {/* Q1.2 Legal Company Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Q1.2: Exact Legal Company Name <span className="text-red font-bold">*</span></label>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Official Registered Company Name (Auto-filled from MCA records based on your CIN).
              </p>
              <div className="relative max-w-xl">
                <input 
                  type="text" 
                  value={formData.companyName} 
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  readOnly={cinStatus === 'verified'} 
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none font-bold ${
                    cinStatus === 'verified' 
                      ? 'border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed' 
                      : 'border-slate-200 text-slate-850 focus:border-primary focus:ring-4 focus:ring-primary/10'
                  }`}
                />
                {cinStatus === 'verified' && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ Fetched from MCA
                  </span>
                )}
              </div>
            </div>

            {/* Q1.3 Registered Corporate Office Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Q1.3: Registered Corporate Office Address <span className="text-red font-bold">*</span></label>
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute left-5 bottom-5 hidden group-hover:block w-72 bg-slate-900 text-white text-[10px] p-3 rounded-lg shadow-xl z-50 leading-relaxed font-semibold">
                    Your registered office is the official address registered with the Registrar of Companies (RoC). All legal notices and regulatory communications will be sent here.
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Enter your complete Registered Office address as per your Certificate of Incorporation. ⚠️ Important: This must match your MCA records exactly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Building/Premises Name <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.addressBuilding} 
                    onChange={(e) => handleInputChange('addressBuilding', e.target.value)}
                    placeholder="Building name or number"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Street/Road Name <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.addressStreet} 
                    onChange={(e) => handleInputChange('addressStreet', e.target.value)}
                    placeholder="Street or road name"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Locality/Area <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.addressLocality} 
                    onChange={(e) => handleInputChange('addressLocality', e.target.value)}
                    placeholder="Locality or area"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">City/Town <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.addressCity} 
                    onChange={(e) => handleInputChange('addressCity', e.target.value)}
                    placeholder="City or town"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">District <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.addressDistrict} 
                    onChange={(e) => handleInputChange('addressDistrict', e.target.value)}
                    placeholder="District name"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">State <span className="text-red">*</span></span>
                  <select 
                    value={formData.addressState}
                    onChange={(e) => handleInputChange('addressState', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary focus:outline-none bg-white font-bold text-slate-700"
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PIN Code <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={formData.addressPinCode} 
                    onChange={(e) => handleInputChange('addressPinCode', e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit PIN code"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none font-bold text-slate-800 ${
                      formData.addressPinCode.length === 6 && !validatePinCodeForState(formData.addressPinCode, formData.addressState)
                        ? 'border-red-400 focus:ring-red-500/10'
                        : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                    }`}
                  />
                  {formData.addressPinCode.length === 6 && !validatePinCodeForState(formData.addressPinCode, formData.addressState) && (
                    <span className="text-[9px] text-red font-bold block">PIN code does not match the selected state.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Q1.4 Contact Information */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Q1.4: Contact Information <span className="text-red font-bold">*</span></label>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Provide official contact details for your company. These will be published in the prospectus for investor communication.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Telephone Number <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="e.g. +91-40-4929342"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Email Address <span className="text-red">*</span></span>
                  <input 
                    type="email" 
                    value={formData.officialEmail}
                    onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                    placeholder="compliance@domain.com"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none font-bold text-slate-800 ${
                      formData.officialEmail.length > 0 && (formData.officialEmail.includes('gmail') || formData.officialEmail.includes('yahoo') || formData.officialEmail.includes('hotmail'))
                        ? 'border-red-400'
                        : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {formData.officialEmail.length > 0 && (formData.officialEmail.includes('gmail') || formData.officialEmail.includes('yahoo') || formData.officialEmail.includes('hotmail')) && (
                    <span className="text-[9px] text-red font-bold block">Please use your official company email domain, not a personal email service.</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Company Website <span className="text-red">*</span></span>
                  <input 
                    type="url" 
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    placeholder="https://www.company.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Q1.5 Number of Promoters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Q1.5: Number of Promoters <span className="text-red font-bold">*</span></label>
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute left-5 bottom-5 hidden group-hover:block w-72 bg-slate-900 text-white text-[10px] p-3 rounded-lg shadow-xl z-50 leading-relaxed font-semibold">
                    As per SEBI regulations, promoters are persons who have control over the company. For SME IPOs, promoters must collectively hold at least 20% post-IPO.
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                How many promoters does your company have? founders and family members who hold significant shareholding.
              </p>

              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => handlePromoterCountChange(formData.promoterCount - 1)}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-650 hover:bg-slate-50 shrink-0 cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-800 bg-slate-50 border border-slate-100 py-1.5 rounded-lg">{formData.promoterCount}</span>
                <button 
                  type="button"
                  onClick={() => handlePromoterCountChange(formData.promoterCount + 1)}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-650 hover:bg-slate-50 shrink-0 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Q1.6 Promoter Details list */}
            <div className="space-y-6">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q1.6: Promoter Details <span className="text-red font-bold">*</span></label>
              
              <div className="space-y-6">
                {formData.promoters.map((promoter, idx) => {
                  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(promoter.pan);
                  const isDinValid = /^[0-9]{8}$/.test(promoter.din) || promoter.din === '';

                  return (
                    <div key={idx} className="border border-slate-100 p-6 rounded-2xl bg-slate-50/20 space-y-5 relative">
                      <span className="text-[10px] bg-slate-100 border border-slate-200/50 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Promoter #{idx + 1} of {formData.promoterCount}
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Q1.6.1 Promoter Full Name */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name <span className="text-red">*</span></span>
                          <input 
                            type="text"
                            value={promoter.name}
                            onChange={(e) => handlePromoterFieldChange(idx, 'name', e.target.value)}
                            placeholder="Exact name as on PAN"
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                          />
                        </div>

                        {/* Q1.6.2 Promoter Type */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Promoter Type <span className="text-red">*</span></span>
                          <select 
                            value={promoter.type}
                            onChange={(e) => handlePromoterFieldChange(idx, 'type', e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary bg-white font-bold text-slate-700"
                          >
                            <option value="Individual Person">Individual Person</option>
                            <option value="Corporate Entity (Company/LLP)">Corporate Entity</option>
                            <option value="Hindu Undivided Family (HUF)">Hindu Undivided Family (HUF)</option>
                            <option value="Trust">Trust</option>
                            <option value="Partnership Firm">Partnership Firm</option>
                          </select>
                        </div>

                        {/* Q1.6.3 Promoter PAN */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PAN (10 uppercase chars) <span className="text-red">*</span></span>
                          <input 
                            type="text"
                            maxLength={10}
                            value={promoter.pan}
                            onChange={(e) => handlePromoterFieldChange(idx, 'pan', e.target.value.toUpperCase())}
                            placeholder="e.g. ABCDE1234F"
                            className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none font-bold text-slate-800 ${
                              promoter.pan.length === 10 && !isPanValid
                                ? 'border-red-400'
                                : 'border-slate-200 focus:border-primary'
                            }`}
                          />
                          {promoter.pan.length === 10 && !isPanValid && (
                            <span className="text-[9px] text-red font-bold block">Invalid PAN format.</span>
                          )}
                        </div>

                        {/* Q1.6.4 DIN number */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DIN (8 digits)</span>
                          <input 
                            type="text"
                            maxLength={8}
                            value={promoter.din}
                            onChange={(e) => handlePromoterFieldChange(idx, 'din', e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 08492311"
                            className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none font-bold text-slate-800 ${
                              promoter.din.length > 0 && !isDinValid
                                ? 'border-red-400'
                                : 'border-slate-200 focus:border-primary'
                            }`}
                          />
                        </div>

                        {/* Q1.6.5 Experience */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Experience (Years) <span className="text-red">*</span></span>
                          <input 
                            type="number"
                            value={promoter.experience || ''}
                            onChange={(e) => handlePromoterFieldChange(idx, 'experience', parseInt(e.target.value) || 0)}
                            placeholder="0-60 years"
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-850"
                          />
                          {promoter.experience > 40 && (
                            <span className="text-[9px] text-warning font-bold block">Please verify experience is correct.</span>
                          )}
                        </div>

                        {/* Q1.6.7 Current Shareholding */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shareholding (%) <span className="text-red">*</span></span>
                          <div className="relative">
                            <input 
                              type="number"
                              step="0.01"
                              value={promoter.shareholding || ''}
                              onChange={(e) => handlePromoterFieldChange(idx, 'shareholding', parseFloat(e.target.value) || 0)}
                              placeholder="e.g. 84.06"
                              className="w-full px-3.5 py-2.5 pr-8 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                          </div>
                        </div>

                        {/* Q1.6.8 Mobile & Email */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Number <span className="text-red">*</span></span>
                          <input 
                            type="text"
                            value={promoter.mobile}
                            onChange={(e) => handlePromoterFieldChange(idx, 'mobile', e.target.value)}
                            placeholder="+91-XXXXXXXXXX"
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address <span className="text-red">*</span></span>
                          <input 
                            type="email"
                            value={promoter.email}
                            onChange={(e) => handlePromoterFieldChange(idx, 'email', e.target.value)}
                            placeholder="promoter@company.com"
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Residential Address <span className="text-red">*</span></span>
                          <input 
                            type="text"
                            value={promoter.address}
                            onChange={(e) => handlePromoterFieldChange(idx, 'address', e.target.value)}
                            placeholder="Complete address with PIN"
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                          />
                        </div>

                        {/* Q1.6.6 Background bio */}
                        <div className="md:col-span-3 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brief Professional Biography (150-500 chars) <span className="text-red">*</span></span>
                          <textarea 
                            rows={3}
                            value={promoter.background}
                            onChange={(e) => handlePromoterFieldChange(idx, 'background', e.target.value)}
                            placeholder="Education, qualifications, and complete industry history summary..."
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-semibold text-slate-800"
                          />
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Min 150 chars required</span>
                            <span className={promoter.background.length < 150 || promoter.background.length > 500 ? 'text-red' : 'text-emerald-600'}>
                              {promoter.background.length} / 500
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Autocalculated promoters shares banner */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-450 font-bold uppercase block">Total Pre-IPO Promoter Holding</span>
                  <span className="text-base font-black text-slate-800 block mt-1">{totalPromoterShares}%</span>
                </div>
                <div>
                  {meetsPromoterMinimum ? (
                    <span className="text-success bg-emerald-50 border border-emerald-150 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                      ✓ Meets SME requirement (≥20%)
                    </span>
                  ) : (
                    <span className="text-red bg-red/5 border border-red/10 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Below SME requirement
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Q1.7 Company Secretary */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q1.7: Company Secretary / Compliance Officer <span className="text-red font-bold">*</span></label>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Designate your Company Secretary or Compliance Officer who will be the primary point of contact for regulatory matters.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CS Name <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.csName}
                    onChange={(e) => handleInputChange('csName', e.target.value)}
                    placeholder="Full legal name"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ICSI Membership Number <span className="text-red">*</span></span>
                  <input 
                    type="text" 
                    value={formData.csIcsiNumber}
                    onChange={(e) => handleInputChange('csIcsiNumber', e.target.value.toUpperCase())}
                    placeholder="ACS12345 or FCS67890"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none font-bold text-slate-800 ${
                      formData.csIcsiNumber.length > 0 && !/^(ACS|FCS)[0-9]{5}$/.test(formData.csIcsiNumber)
                        ? 'border-red-400'
                        : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email <span className="text-red">*</span></span>
                  <input 
                    type="email" 
                    value={formData.csEmail}
                    onChange={(e) => handleInputChange('csEmail', e.target.value)}
                    placeholder="cs@company.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads section for Step 1 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">📄 Upload Supporting Documents for Corporate Identity & Promoter Details</h4>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                All documents must be in PDF format, clear and legible. Maximum file size is specified for each document type.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Incorporation doc */}
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-slate-50/30">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-850 block">Certificate of Incorporation</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Suggested: Certificate_of_Incorporation_{formData.cin}.pdf</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('docCertIncorporation', !formData.docCertIncorporation)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      formData.docCertIncorporation ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {formData.docCertIncorporation ? 'Uploaded' : 'Upload'}
                  </button>
                </div>

                {/* MOA */}
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-slate-50/30">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-855 block">Memorandum of Association (MOA)</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Suggested: MOA_{formData.companyName.replace(/ /g, '_')}.pdf</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('docMoa', !formData.docMoa)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      formData.docMoa ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {formData.docMoa ? 'Uploaded' : 'Upload'}
                  </button>
                </div>

                {/* AOA */}
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-slate-50/30">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-855 block">Articles of Association (AOA)</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Suggested: AOA_{formData.companyName.replace(/ /g, '_')}.pdf</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('docAoa', !formData.docAoa)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      formData.docAoa ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {formData.docAoa ? 'Uploaded' : 'Upload'}
                  </button>
                </div>

                {/* Promoter resumes */}
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-slate-50/30">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-855 block">Promoter Resumes/Profiles</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Suggested: Promoter_Profiles_All.pdf</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('docPromoterResumes', !formData.docPromoterResumes)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      formData.docPromoterResumes ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {formData.docPromoterResumes ? 'Uploaded' : 'Upload'}
                  </button>
                </div>

                {/* PAN Cards */}
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-slate-50/30">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-855 block">PAN Cards (All Promoters)</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Suggested: PAN_Cards_Promoters.pdf</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('docPanCards', !formData.docPanCards)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      formData.docPanCards ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {formData.docPanCards ? 'Uploaded' : 'Upload'}
                  </button>
                </div>

                {/* Address proof */}
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-slate-50/30">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-855 block">Address Proof (Registered Office)</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Suggested: Registered_Office_Address_Proof.pdf</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('docAddressProof', !formData.docAddressProof)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      formData.docAddressProof ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {formData.docAddressProof ? 'Uploaded' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkpoint Validation summary display */}
            <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold text-slate-800 block uppercase tracking-wide">Step 1 Validation Checklist</span>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-success stroke-[2.5]" />
                  <span>Company CIN Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-success stroke-[2.5]" />
                  <span>CS Membership ID Logged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-success stroke-[2.5]" />
                  <span>Pre-IPO Shares Match Eligibility ({totalPromoterShares}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {formData.docCertIncorporation && formData.docMoa && formData.docAoa ? (
                    <Check className="w-4 h-4 text-success stroke-[2.5]" />
                  ) : (
                    <X className="w-4 h-4 text-red" />
                  )}
                  <span>All Annexures Uploaded</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => selectActiveStep(2)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <span>Save & Proceed Step 2</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Business & Operations Overview */}
        {activeStep === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">📍 STEP 2: BUSINESS & OPERATIONS OVERVIEW</h3>
              <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                Now let&apos;s understand what your company does, the products/services you offer, and your operational footprint. This will form the core business description in your prospectus.
              </p>
            </div>

            {/* Q2.1 Primary Business Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q2.1: Primary Business Model Description <span className="text-red font-bold">*</span></label>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Describe your company&apos;s primary business model and core operations in simple, clear language. Write as if explaining to an investor.<br />
                ⚠️ Avoid promotional phrases like &ldquo;best in class&rdquo; or &ldquo;leading player&rdquo;. Focus on factual description.
              </p>
              <textarea 
                rows={5}
                value={formData.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-semibold text-slate-800 outline-none"
                placeholder="We are engaged in the business of designing, manufacturing..."
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>300-800 characters</span>
                <span className={formData.businessModel.length < 300 || formData.businessModel.length > 800 ? 'text-red' : 'text-emerald-600'}>
                  {formData.businessModel.length} / 800
                </span>
              </div>
              {hasPromoPhrases && (
                <p className="text-[10px] text-warning font-bold flex items-center gap-1.5 bg-amber-50 border border-amber-100/50 p-2.5 rounded-xl">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Avoid promotional phrases like &apos;best in class&apos; or &apos;leading player&apos;. Focus on factual description.</span>
                </p>
              )}
            </div>

            {/* Q2.2 Core Products list */}
            <div className="space-y-5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q2.2: Core Products/Services Offered (Min 2, Max 10) <span className="text-red font-bold">*</span></label>
              
              <div className="space-y-4">
                {formData.products.map((product, idx) => (
                  <div key={idx} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/20 space-y-4 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold bg-slate-100 border border-slate-200/50 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                        Product/Service #{idx + 1}
                      </span>
                      {formData.products.length > 2 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveProduct(idx)}
                          className="text-slate-400 hover:text-red p-1 rounded-lg hover:bg-red/5 cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product Name <span className="text-red">*</span></span>
                        <input 
                          type="text"
                          value={product.name}
                          onChange={(e) => handleProductFieldChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Oil-Filled Transformers"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category <span className="text-red">*</span></span>
                        <select 
                          value={product.category}
                          onChange={(e) => handleProductFieldChange(idx, 'category', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-primary bg-white font-bold text-slate-700"
                        >
                          <option value="Manufactured Product">Manufactured Product</option>
                          <option value="Traded Product">Traded Product</option>
                          <option value="Service Offering">Service Offering</option>
                          <option value="Software/Digital Product">Software/Digital Product</option>
                          <option value="Hybrid (Product + Service)">Hybrid (Product + Service)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue Contribution (%) <span className="text-red">*</span></span>
                        <input 
                          type="number"
                          value={product.revenueContribution || ''}
                          onChange={(e) => handleProductFieldChange(idx, 'revenueContribution', e.target.value)}
                          placeholder="0-100%"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description (100-300 chars) <span className="text-red">*</span></span>
                        <textarea 
                          rows={2}
                          value={product.description}
                          onChange={(e) => handleProductFieldChange(idx, 'description', e.target.value)}
                          placeholder="Technical features, specifications..."
                          className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-xl focus:border-primary font-semibold text-slate-800"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-0.5">
                          <span>Min 100 chars</span>
                          <span className={product.description.length < 100 || product.description.length > 300 ? 'text-red' : 'text-emerald-600'}>
                            {product.description.length} / 300
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  onClick={handleAddProduct}
                  disabled={formData.products.length >= 10}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    formData.products.length >= 10 ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-primary border-primary hover:bg-slate-50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>

                <div className="text-xs font-bold text-slate-650">
                  Total revenue split sum:{' '}
                  <span className={totalProductRevenue === 100 ? 'text-success' : 'text-warning'}>
                    {totalProductRevenue}% of 100%
                  </span>
                </div>
              </div>
            </div>

            {/* Q2.3 Industries served checkboxes */}
            <div className="space-y-3.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q2.3: Industries/Sectors Served <span className="text-red font-bold">*</span></label>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Which industries or end-user sectors do you primarily serve? Select all that apply.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {[
                  'Railways & Metro Rail', 'Renewable Energy (Solar, Wind)', 'Power Generation & Distribution', 
                  'Industrial Manufacturing', 'Infrastructure & Construction', 'Oil & Gas', 'Defense', 'Government/PSUs'
                ].map(sector => {
                  const isChecked = formData.sectorsServed.includes(sector);
                  return (
                    <label key={sector} className="flex items-start gap-2 text-xs font-bold text-slate-650 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSectorCheck(sector)}
                        className="w-4 h-4 border border-slate-200 text-primary rounded mt-0.5"
                      />
                      <span>{sector}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Q2.4 Detailed Sector revenue breakdown dynamic table */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q2.4: Detailed Sector-wise Revenue Breakdown <span className="text-red font-bold">*</span></label>
              <p className="text-[11px] text-slate-450 font-semibold leading-relaxed">
                Provide a breakdown of your revenue by industry sector for the last financial year. (Populated based on Q2.3 checkbox selections).
              </p>

              {formData.sectorsServed.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 text-center rounded-2xl text-xs text-slate-450 font-bold bg-slate-50/30">
                  Select at least one sector in Q2.3 to populate the breakdown matrix.
                </div>
              ) : (
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-3.5 pl-4 w-[35%]">Sector/Industry</th>
                        <th className="p-3.5 w-[20%]">Revenue (₹ Lakhs)</th>
                        <th className="p-3.5 w-[15%]">% of Total</th>
                        <th className="p-3.5 pr-4 w-[30%]">Key Customers in Sector</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {formData.sectorsServed.map(sector => {
                        const cellData = formData.sectorBreakdowns[sector] || { revenue: 0, customers: '' };
                        const sharePct = totalSectorRevenue > 0 ? ((cellData.revenue / totalSectorRevenue) * 100).toFixed(1) : '0.0';

                        return (
                          <tr key={sector} className="hover:bg-slate-50/20">
                            <td className="p-4 pl-4 font-bold text-slate-800">{sector}</td>
                            <td className="p-3">
                              <input 
                                type="number"
                                value={cellData.revenue || ''}
                                onChange={(e) => handleSectorBreakdownChange(sector, 'revenue', e.target.value)}
                                placeholder="₹ Lakhs"
                                className="w-32 px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-bold text-slate-800 bg-white"
                              />
                            </td>
                            <td className="p-3 font-bold text-primary">{sharePct}%</td>
                            <td className="p-3 pr-4">
                              <input 
                                type="text"
                                value={cellData.customers}
                                onChange={(e) => handleSectorBreakdownChange(sector, 'customers', e.target.value)}
                                placeholder="Key customer titles..."
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-semibold text-slate-850 bg-white"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {maxSectorContribution > 50 && (
                <div className="p-3 bg-amber-50 border border-amber-100/50 rounded-xl text-[10px] text-warning font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>⚠️ High concentration risk detected: One sector contributes {maxSectorContribution.toFixed(1)}% of total revenue. This will be automatically flagged in prospectus Risk Factors.</span>
                </div>
              )}
            </div>

            {/* Q2.5 and Q2.6 Capacity parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Q2.5 Installed Capacity */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q2.5: Installed Capacity <span className="text-red font-bold">*</span></label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    value={formData.capacityValue || ''}
                    onChange={(e) => handleInputChange('capacityValue', parseInt(e.target.value) || 0)}
                    placeholder="Installed capacity value"
                    className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                  />
                  <select
                    value={formData.capacityUnit}
                    onChange={(e) => handleInputChange('capacityUnit', e.target.value)}
                    className="w-48 px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-primary bg-white font-bold text-slate-700"
                  >
                    <option value="MVA per annum">MVA per annum</option>
                    <option value="Units per month">Units per month</option>
                    <option value="Tonnes per annum">Tonnes per annum</option>
                    <option value="Square feet">Square feet</option>
                    <option value="Service hours per month">Service hours per month</option>
                  </select>
                </div>
              </div>

              {/* Q2.6 Capacity Utilization rate slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Q2.6: Current Capacity Utilization <span className="text-red font-bold">*</span></label>
                  <span className="text-xs font-black text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    {formData.capacityUtilization}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={formData.capacityUtilization}
                    onChange={(e) => handleInputChange('capacityUtilization', parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 rounded-lg bg-slate-100 accent-primary appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">
                    Utilization rate = (Actual production / Installed capacity) × 100
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={() => selectActiveStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Step 1
              </button>
              <button 
                onClick={() => selectActiveStep(3)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <span>Save & Proceed Step 3</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Financial Performance */}
        {activeStep === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">Section C: Financial Information & Performance</h3>
              <p className="text-xs text-slate-450 mt-1.5 font-semibold">3-Year financial track record standalone highlights. Values in ₹ Crores.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Standalone Revenue */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">FY 2024 Revenue (₹ Cr)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.fy24Revenue}
                  onChange={(e) => handleInputChange('fy24Revenue', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">FY 2025 Revenue (₹ Cr)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.fy25Revenue}
                  onChange={(e) => handleInputChange('fy25Revenue', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">FY 2026 Revenue (₹ Cr)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.fy26Revenue}
                  onChange={(e) => handleInputChange('fy26Revenue', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                />
              </div>

              {/* PAT */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">FY 2024 PAT (₹ Cr)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.fy24Pat}
                  onChange={(e) => handleInputChange('fy24Pat', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">FY 2025 PAT (₹ Cr)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.fy25Pat}
                  onChange={(e) => handleInputChange('fy25Pat', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">FY 2026 PAT (₹ Cr)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.fy26Pat}
                  onChange={(e) => handleInputChange('fy26Pat', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={() => selectActiveStep(2)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Step 2
              </button>
              <button 
                onClick={() => selectActiveStep(4)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <span>Save & Continue Step 4</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Business Model & Operations */}
        {activeStep === 4 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">Section D: Business Model & Operations</h3>
              <p className="text-xs text-slate-450 mt-1.5 font-semibold">Details on your core value proposition, USP, and operational parameters.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">Plain-Language Business Description</label>
                <textarea 
                  rows={3}
                  value={formData.businessModel}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">Unique Selling Proposition (USP)</label>
                <textarea 
                  rows={2}
                  value={formData.usp}
                  onChange={(e) => handleInputChange('usp', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={() => selectActiveStep(3)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Step 3
              </button>
              <button 
                onClick={() => selectActiveStep(5)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <span>Save & Continue Step 5</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Use of Funds */}
        {activeStep === 5 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">Section E: IPO Structure & Capital Deployment</h3>
              <p className="text-xs text-slate-450 mt-1.5 font-semibold">Verify IPO proceeds allocation and review the visual distribution percentages.</p>
            </div>
            
            <StepFiveForm onStepComplete={() => selectActiveStep(6)} />
          </div>
        )}

        {/* Step 6: Risk Factors */}
        {activeStep === 6 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">Section F: Risk Factors & Disclosures</h3>
              <p className="text-xs text-slate-455 mt-1.5 font-semibold font-sans">Disclose primary industry-specific and company-specific risks.</p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] bg-red/5 border border-red/10 text-red px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                SEBI Mandatory Disclosure: Minimum 5 risks required
              </span>

              <div className="space-y-4 pt-2">
                <div className="border border-slate-150 p-4.5 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-800 block">Risk 1: {formData.risk1Title}</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{formData.risk1Description}</p>
                </div>

                <div className="border border-slate-150 p-4.5 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-800 block">Risk 2: {formData.risk2Title}</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{formData.risk2Description}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={() => selectActiveStep(5)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Step 5
              </button>
              <button 
                onClick={() => selectActiveStep(7)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <span>Save & Continue Step 7</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Legal & Compliance */}
        {activeStep === 7 && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">Section G: Legal & Litigation</h3>
              <p className="text-xs text-slate-450 mt-1.5 font-semibold">Disclose civil, criminal, and tax litigations affecting promoters or the company.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">Total Litigations Involving Company</label>
                <input 
                  type="number" 
                  value={formData.litigationsCount}
                  onChange={(e) => handleInputChange('litigationsCount', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={() => selectActiveStep(6)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Step 6
              </button>
              <button 
                onClick={() => selectActiveStep(8)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <span>Save & Continue Step 8</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Review & Submit */}
        {activeStep === 8 && (
          <form onSubmit={handleFinalSubmit} className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-base font-bold text-slate-800">Section J: Review, Validation & Submission</h3>
              <p className="text-xs text-slate-450 mt-1.5 font-semibold font-sans">Review validation scoring and e-sign the declaration to finalize your DRHP submission.</p>
            </div>

            <div className="space-y-6">
              {/* Consistency Check Log */}
              <div className="border border-slate-100 p-6 rounded-xl space-y-4 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Data Completeness & Consistency Check</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-success text-xs font-semibold">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Section A: Corporate Identity & Address - 100% Complete</span>
                  </div>
                </div>
              </div>

              {/* DSC Signature Input & Cursive Live Display */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block uppercase tracking-wide">Authorized Signatory Name</label>
                    <input 
                      type="text" 
                      value={formData.signatory}
                      onChange={(e) => handleInputChange('signatory', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-primary font-semibold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Cursive handwritten digital signature verification display */}
                <div className="p-5 border border-dashed border-slate-200 rounded-2xl bg-slate-50/40 flex flex-col md:flex-row md:items-center md:justify-between gap-5 max-w-2xl">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Real-time Digital Signature Preview</span>
                    <div className="mt-2.5 px-6 py-4.5 bg-white border border-slate-100 rounded-2xl shadow-inner min-h-20 flex items-center justify-center relative overflow-hidden select-none">
                      <span className="absolute top-1.5 left-2.5 text-[8px] text-slate-350 font-bold tracking-wider uppercase">DSC Class 3 Signatory</span>
                      {/* Signature cursive script */}
                      <p className="font-serif italic text-2xl text-blue-600 tracking-wider font-semibold select-none transform -rotate-1.5 leading-none">
                        {formData.signatory || 'Signatory Name'}
                      </p>
                      {/* Seal verification */}
                      <div className="absolute right-2.5 bottom-1.5 flex items-center gap-1 opacity-80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] text-emerald-600 font-bold tracking-widest uppercase">Verified DSC</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-64 space-y-1.5 shrink-0">
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> MCA DSC Secured
                    </span>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                      This signature links directly to verified DIN credentials. Signing authorizes official submission to SEBI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.declarationAccepted}
                    onChange={(e) => handleInputChange('declarationAccepted', e.target.checked)}
                    className="w-4.5 h-4.5 border border-slate-250 rounded text-primary mt-0.5 focus:ring-primary/20 cursor-pointer"
                    required
                  />
                  <span className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                    I/We hereby declare that all information provided in this questionnaire matches our corporate records and no material disclosures required under SEBI guidelines have been suppressed or hidden.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => selectActiveStep(7)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Step 7
              </button>
              <button 
                type="submit"
                disabled={!formData.declarationAccepted}
                className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                  formData.declarationAccepted 
                    ? 'bg-primary hover:bg-primary-light text-white shadow-primary/25 cursor-pointer' 
                    : 'bg-slate-200 text-slate-450 cursor-not-allowed shadow-none'
                }`}
              >
                <span>⚙️ Submit to Lead Manager & Generate DRHP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
