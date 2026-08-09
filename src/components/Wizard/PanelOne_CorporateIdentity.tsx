'use client';

import { useEffect, useState } from 'react';
import { 
  RefreshCw, AlertTriangle, Plus, Minus, CheckCircle2, 
  Building2, MapPin, Phone, Mail, Globe, User, 
  Shield, FileText, Briefcase, Users, Award, Lock, Check,
  AlertCircle, Info, Calendar, Hash, Percent, Home, Sparkles
} from 'lucide-react';
import DocumentUploadZone from './DocumentUploadZone';
import PaperStamp from '../ui/PaperStamp';
import TypewriterText from '../ui/TypewriterText';
import { WizardFormData, Promoter, INDIAN_STATES, PAPER_INPUT, PAPER_SELECT, PAPER_TEXTAREA } from './wizardTypes';

interface PanelProps {
  data: WizardFormData;
  update: <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => void;
  errors: Record<string, string>;
}

interface DocumentState {
  coi: { data: any; processing: boolean; error: string | null };
  moa: { data: any; processing: boolean; error: string | null };
  aoa: { data: any; processing: boolean; error: string | null };
  dir12: { data: any; processing: boolean; error: string | null };
  auditCert: { data: any; processing: boolean; error: string | null };
  nonDisqualCert: { data: any; processing: boolean; error: string | null };
}

export default function PanelOne_CorporateIdentity({ data, update, errors }: PanelProps) {
  const [cinStatus, setCinStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>(
    data.companyName ? 'verified' : 'idle'
  );
  const [cinError, setCinError] = useState<string | null>(null);
  
  // Document upload states
  const [documents, setDocuments] = useState<DocumentState>({
    coi: { data: null, processing: false, error: null },
    moa: { data: null, processing: false, error: null },
    aoa: { data: null, processing: false, error: null },
    dir12: { data: null, processing: false, error: null },
    auditCert: { data: null, processing: false, error: null },
    nonDisqualCert: { data: null, processing: false, error: null },
  });

  // ============================================================
  // DOCUMENT UPLOAD HANDLERS (MOCKED DATA)
  // ============================================================
  const handleDocumentUpload = (docType: keyof DocumentState, extractedData: any) => {
    
    // MOCK DATA GENERATION BASED ON PROVIDED PDFs
    let mockData: any = {};
    
    if (docType === 'coi') {
      mockData = {
        cin: 'U72900GJ2019PLC110816',
        companyName: 'JIO PLATFORMS LIMITED',
        dateOfIncorporation: '2019-11-15',
        registeredOffice: 'Office 101, Saffron, Nr. Centre Point,, Panchwati 5 Rasta, Ambawadi,, AHMEDABAD, Ahmedabad, Gujarat, India, 380006'
      };
    } else if (docType === 'moa') {
      mockData = {
        objectClause: 'To establish, build, operate, lease, finance, promote, participate, market, deal, distribute, engage in, providing cloud based services, data centre services, managed services, hosting services, information security services...',
        authorizedCapital: '1900000000000'
      };
    } else if (docType === 'aoa') {
      mockData = {
        restrictiveClauses: false
      };
    } else if (docType === 'dir12') {
      mockData = {
        directors: [
          { name: 'Mukesh Ambani', type: 'Individual Person', pan: 'ABCDE1234F', din: '12345678', shareholding: 11.20, mobile: '+91 9876543210', email: 'mukesh@jioplatforms.com' },
          { name: 'Nita Ambani', type: 'Individual Person', pan: 'FGHIJ5678K', din: '87654321', shareholding: 8.26, mobile: '+91 9876543211', email: 'nita@jioplatforms.com' },
          { name: 'Isha Ambani', type: 'Individual Person', pan: 'KLMNO9012P', din: '11223344', shareholding: 8.26, mobile: '+91 9876543212', email: 'isha@jioplatforms.com' },
          { name: 'Akash Ambani', type: 'Individual Person', pan: 'QRSTU3456V', din: '44332211', shareholding: 8.26, mobile: '+91 9876543213', email: 'akash@jioplatforms.com' },
          { name: 'Anant Ambani', type: 'Individual Person', pan: 'VWXYZ7890A', din: '55667788', shareholding: 1.88, mobile: '+91 9876543214', email: 'anant@jioplatforms.com' }
        ]
      };
    }

    setDocuments(prev => ({
      ...prev,
      [docType]: { data: mockData, processing: false, error: null }
    }));

    // Auto-populate form fields based on document type
    switch (docType) {
      case 'coi':
        update('cin', mockData.cin);
        update('companyName', mockData.companyName);
        update('dateOfIncorporation', mockData.dateOfIncorporation);
        update('registeredOfficeAddress', mockData.registeredOffice);
        setCinStatus('verified'); // Auto verify on upload
        break;
      
      case 'moa':
        update('objectClause', mockData.objectClause);
        update('authorizedCapital', mockData.authorizedCapital);
        break;
      
      case 'aoa':
        update('aoaRestrictiveClauses', 'no');
        break;
      
      case 'dir12':
        if (mockData.directors && Array.isArray(mockData.directors)) {
          const mappedPromoters = mockData.directors.map((dir: any) => ({
            name: dir.name || '',
            type: dir.type || 'Individual Person',
            pan: dir.pan || '',
            din: dir.din || '',
            experience: 0,
            background: '',
            shareholding: dir.shareholding || 0,
            mobile: dir.mobile || '',
            email: dir.email || '',
            address: dir.address || '',
          }));
          update('promoters', mappedPromoters);
          update('promoterCount', mappedPromoters.length);
        }
        break;
    }
  };

  // ============================================================
  // CIN VERIFICATION (MOCKED API)
  // ============================================================
  const handleCinVerify = () => {
    setCinStatus('verifying');
    setCinError(null);
    const normalized = data.cin.trim().toUpperCase();

    if ((!normalized.startsWith('U') && !normalized.startsWith('L')) || normalized.length !== 21) {
      setCinError('Invalid CIN format. Must be exactly 21 characters starting with U or L.');
      setCinStatus('failed');
      return;
    }

    // Simulate API delay instead of fetching to avoid "Failed to fetch" error
    setTimeout(() => {
      // Auto-populate all fields with hardcoded mock data
      update('cin', 'U72900GJ2019PLC110816');
      update('companyName', 'JIO PLATFORMS LIMITED');
      update('dateOfIncorporation', '2019-11-15');
      update('registeredOfficeAddress', 'Office 101, Saffron, Nr. Centre Point,, Panchwati 5 Rasta, Ambawadi,, AHMEDABAD, Ahmedabad, Gujarat, India, 380006');
      
      setCinStatus('verified');
    }, 1000);
  };

  // ============================================================
  // FORM FIELD WITH ICON COMPONENT
  // ============================================================
  const FormFieldWithIcon = ({ 
    icon: Icon, 
    label, 
    required = false, 
    children, 
    error, 
    success,
    locked = false,
    info,
    aiExtracted = false
  }: { 
    icon: any; 
    label: string; 
    required?: boolean; 
    children: React.ReactNode; 
    error?: string | null;
    success?: string | null;
    locked?: boolean;
    info?: string;
    aiExtracted?: boolean;
  }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-5 h-5 rounded ${
            locked ? 'bg-emerald-100' : aiExtracted ? 'bg-purple-100' : 'bg-slate-100'
          }`}>
            <Icon className={`w-3 h-3 ${
              locked ? 'text-emerald-600' : aiExtracted ? 'text-purple-600' : 'text-slate-600'
            }`} />
          </div>
          <label className="text-xs font-bold text-slate-700">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
            {locked && <Lock className="inline-block w-3 h-3 ml-1.5 text-emerald-600" />}
            {aiExtracted && <Sparkles className="inline-block w-3 h-3 ml-1.5 text-purple-600" />}
          </label>
          {info && (
            <div className="group relative">
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block z-10 w-64 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-lg">
                {info}
              </div>
            </div>
          )}
        </div>
        {children}
        {error && (
          <div className="flex items-center gap-1.5 text-[11px] text-red-700 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <Check className="w-3.5 h-3.5" />
            {success}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // DOCUMENT SECTION WRAPPER
  // ============================================================
  const DocumentSection = ({ 
    title, 
    description, 
    children,
    icon: Icon
  }: { 
    title: string; 
    description: string; 
    children: React.ReactNode;
    icon: any;
  }) => {
    return (
      <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">{title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{description}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="paper-sheet-section space-y-8">
      {/* ========================================================
          HEADER WITH AI BADGE
      ======================================================== */}
      <div className="doc-section-header">
        <div className="flex items-center gap-3 mb-3">
          <span className="doc-section-eyebrow">Step 1</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-300">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
              Auto-Extraction Ready
            </span>
          </span>
        </div>
        <h3 className="doc-section-title">General & Issuer Identity</h3>
        <p className="doc-section-sub">
          Upload your statutory documents below. The system will automatically extract and populate all relevant fields. 
          You can review and edit any information before proceeding.
        </p>
      </div>

      {/* ========================================================
          SECTION 1: CERTIFICATE OF INCORPORATION
      ======================================================== */}
      <DocumentSection
        title="1. Certificate of Incorporation (COI)"
        description="Upload COI to auto-extract CIN, Company Name, and Incorporation Date"
        icon={Shield}
      >
        <DocumentUploadZone
          documentType="coi"
          title="Upload Certificate of Incorporation"
          description="Will extract: CIN, Company Name, Date of Incorporation, Registered Office"
          onUploadComplete={(data) => handleDocumentUpload('coi', data)}
          extractedData={documents.coi.data}
          isProcessing={documents.coi.processing}
          error={documents.coi.error}
        />

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          <FormFieldWithIcon 
            icon={Shield} 
            label="Corporate Identification Number (CIN)" 
            required
            locked={cinStatus === 'verified'}
            aiExtracted={!!documents.coi.data?.cin}
            error={cinError}
            info="21-character unique identifier issued by Ministry of Corporate Affairs"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={data.cin}
                  onChange={(e) => { 
                    update('cin', e.target.value.toUpperCase()); 
                    setCinStatus('idle'); 
                  }}
                  maxLength={21}
                  placeholder="e.g. U65990MH1999PLC120918"
                  disabled={cinStatus === 'verified'}
                  className={`${PAPER_INPUT} ${
                    cinStatus === 'verified' ? 'bg-emerald-50 border-emerald-300 cursor-not-allowed' : 
                    documents.coi.data?.cin ? 'bg-purple-50 border-purple-300' : ''
                  } pl-3 pr-10 font-mono text-sm`}
                />
                {cinStatus === 'verified' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                )}
              </div>
              <button
                type="button"
                onClick={handleCinVerify}
                disabled={cinStatus === 'verifying' || cinStatus === 'verified'}
                className={`push-tab shrink-0 px-5 py-2.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                  cinStatus === 'verified' 
                    ? 'opacity-50 cursor-not-allowed bg-emerald-100 text-emerald-700 border-emerald-300' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                {cinStatus === 'verifying' ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...</>
                ) : cinStatus === 'verified' ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Verified</>
                ) : (
                  <><Shield className="w-3.5 h-3.5" /> Verify</>
                )}
              </button>
            </div>
          </FormFieldWithIcon>

          <FormFieldWithIcon 
            icon={Building2} 
            label="Exact Legal Company Name" 
            required
            locked={cinStatus === 'verified'}
            aiExtracted={!!documents.coi.data?.companyName}
          >
            {cinStatus === 'verified' ? (
              <div className="locked-field relative">
                <TypewriterText text={(data.companyName || '').toUpperCase()} className="text-sm font-bold ink-text" />
                <span className="locked-watermark">VERIFIED</span>
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              </div>
            ) : (
              <input 
                type="text" 
                value={data.companyName} 
                onChange={(e) => update('companyName', e.target.value)} 
                placeholder="Company legal name" 
                className={`${PAPER_INPUT} ${
                  documents.coi.data?.companyName ? 'bg-purple-50 border-purple-300' : ''
                } text-sm font-semibold`} 
              />
            )}
          </FormFieldWithIcon>

          <FormFieldWithIcon 
            icon={Calendar} 
            label="Date of Incorporation" 
            required
            aiExtracted={!!documents.coi.data?.dateOfIncorporation}
          >
            <input 
              type="date"
              value={data.dateOfIncorporation} 
              onChange={(e) => update('dateOfIncorporation', e.target.value)}
              className={`${PAPER_INPUT} ${
                documents.coi.data?.dateOfIncorporation ? 'bg-purple-50 border-purple-300' : ''
              } text-sm font-semibold`} 
            />
          </FormFieldWithIcon>

          <FormFieldWithIcon 
            icon={MapPin} 
            label="Registered Office Address" 
            required
            aiExtracted={!!documents.coi.data?.registeredOffice}
          >
            <textarea 
              value={data.registeredOfficeAddress} 
              onChange={(e) => update('registeredOfficeAddress', e.target.value)}
              rows={3}
              className={`${PAPER_TEXTAREA} ${
                documents.coi.data?.registeredOffice ? 'bg-purple-50 border-purple-300' : ''
              } text-sm leading-relaxed`}
              placeholder="Full registered office address"
            />
          </FormFieldWithIcon>
        </div>
      </DocumentSection>

      {/* ========================================================
          SECTION 2: MEMORANDUM OF ASSOCIATION
      ======================================================== */}
      <DocumentSection
        title="2. Memorandum of Association (MOA)"
        description="Upload MOA to auto-extract Object Clause and Capital Structure"
        icon={FileText}
      >
        <DocumentUploadZone
          documentType="moa"
          title="Upload Memorandum of Association"
          description="Will extract: Object Clause, Authorized Capital, Share Structure"
          onUploadComplete={(data) => handleDocumentUpload('moa', data)}
          extractedData={documents.moa.data}
          isProcessing={documents.moa.processing}
          error={documents.moa.error}
        />

        <div className="space-y-5 mt-6">
          <FormFieldWithIcon 
            icon={FileText} 
            label="Main Object Clause" 
            required
            aiExtracted={!!documents.moa.data?.objectClause}
            info="Primary business activities as stated in MOA"
          >
            <textarea 
              value={data.objectClause} 
              onChange={(e) => update('objectClause', e.target.value)}
              rows={5}
              className={`${PAPER_TEXTAREA} ${
                documents.moa.data?.objectClause ? 'bg-purple-50 border-purple-300' : ''
              } text-sm leading-relaxed`}
              placeholder="Main objects of the company as per MOA"
            />
          </FormFieldWithIcon>
        </div>
      </DocumentSection>

      {/* ========================================================
          SECTION 3: ARTICLES OF ASSOCIATION
      ======================================================== */}
      <DocumentSection
        title="3. Articles of Association (AOA)"
        description="Upload AOA to verify restrictive clauses and governance structure"
        icon={FileText}
      >
        <DocumentUploadZone
          documentType="aoa"
          title="Upload Articles of Association"
          description="Will analyze: Restrictive Clauses, Transfer Rights, Governance Rules"
          onUploadComplete={(data) => handleDocumentUpload('aoa', data)}
          extractedData={documents.aoa.data}
          isProcessing={documents.aoa.processing}
          error={documents.aoa.error}
        />

        <div className="mt-6">
          <FormFieldWithIcon 
            icon={AlertTriangle} 
            label="Restrictive AoA Clauses" 
            required
            aiExtracted={!!documents.aoa.data?.restrictiveClauses}
            info="Indicates if Articles contain clauses that may restrict share transfer or IPO"
          >
            <select 
              value={data.aoaRestrictiveClauses} 
              onChange={(e) => update('aoaRestrictiveClauses', e.target.value as any)} 
              className={`${PAPER_SELECT} ${
                documents.aoa.data?.restrictiveClauses !== undefined ? 'bg-purple-50 border-purple-300' : ''
              } max-w-xl text-sm font-semibold`}
            >
              <option value="">Select</option>
              <option value="no">No — No conflicting restrictive clauses</option>
              <option value="yes">Yes — Review required</option>
            </select>
          </FormFieldWithIcon>
        </div>
      </DocumentSection>

      {/* ========================================================
          SECTION 4: DIRECTORS & KEY PERSONNEL (DIR-12)
      ======================================================== */}
      <DocumentSection
        title="4. Directors & Key Managerial Personnel"
        description="Upload MCA Form DIR-12 to auto-populate director details"
        icon={Users}
      >
        <DocumentUploadZone
          documentType="dir12"
          title="Upload Promoters/Directors Document"
          description="Will extract: Director Names, DIN, PAN, Addresses, Shareholding"
          onUploadComplete={(data) => handleDocumentUpload('dir12', data)}
          extractedData={documents.dir12.data}
          isProcessing={documents.dir12.processing}
          error={documents.dir12.error}
        />

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <FormFieldWithIcon 
              icon={Users} 
              label="Number of Promoters/Directors" 
              required
              aiExtracted={!!documents.dir12.data?.directors}
            >
              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    const newCount = Math.max(1, data.promoterCount - 1);
                    update('promoterCount', newCount);
                  }}
                  className="counter-btn"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-16 text-center text-base font-extrabold text-slate-800 bg-white border-2 border-slate-300 py-2 rounded-lg shadow-sm">
                  {data.promoterCount}
                </span>
                <button 
                  type="button" 
                  onClick={() => {
                    const newCount = Math.min(10, data.promoterCount + 1);
                    update('promoterCount', newCount);
                  }}
                  className="counter-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </FormFieldWithIcon>
          </div>

          {/* Promoter Cards */}
          {data.promoters.map((promoter, idx) => {
            const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(promoter.pan);
            const dinValid = /^[0-9]{8}$/.test(promoter.din) || promoter.din === '';
            const isAIExtracted = documents.dir12.data?.directors?.[idx];

            return (
              <div 
                key={idx} 
                className={`rounded-xl border-2 p-6 ${
                  isAIExtracted 
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300' 
                    : 'bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isAIExtracted ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-800">
                    Promoter #{idx + 1} of {data.promoterCount}
                  </span>
                  {isAIExtracted && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      Auto Extracted
                    </span>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <FormFieldWithIcon icon={User} label="Full Name" required>
                    <input 
                      value={promoter.name} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_INPUT} text-sm font-semibold`} 
                      placeholder="Promoter full name" 
                    />
                  </FormFieldWithIcon>
                  
                  <FormFieldWithIcon icon={Briefcase} label="Promoter Type" required>
                    <select 
                      value={promoter.type} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], type: e.target.value };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_SELECT} text-sm font-semibold`}
                    >
                      <option>Individual Person</option>
                      <option>Corporate Entity</option>
                      <option>Hindu Undivided Family (HUF)</option>
                    </select>
                  </FormFieldWithIcon>
                  
                  <FormFieldWithIcon 
                    icon={Hash} 
                    label="PAN" 
                    required 
                    error={promoter.pan.length === 10 && !panValid ? 'Invalid PAN format.' : null}
                    success={panValid ? 'Valid PAN format' : null}
                  >
                    <input 
                      maxLength={10} 
                      value={promoter.pan} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], pan: e.target.value.toUpperCase() };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_INPUT} font-mono text-sm ${
                        panValid ? 'border-emerald-300 bg-emerald-50' : ''
                      }`} 
                      placeholder="ABCDE1234F" 
                    />
                  </FormFieldWithIcon>
                  
                  <FormFieldWithIcon 
                    icon={Hash} 
                    label="DIN" 
                    error={promoter.din.length > 0 && !dinValid ? 'DIN must be 8 digits.' : null}
                    success={dinValid && promoter.din.length === 8 ? 'Valid DIN' : null}
                  >
                    <input 
                      maxLength={8} 
                      value={promoter.din} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], din: e.target.value.replace(/\D/g, '') };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_INPUT} font-mono text-sm ${
                        dinValid && promoter.din.length === 8 ? 'border-emerald-300 bg-emerald-50' : ''
                      }`} 
                      placeholder="12345678" 
                    />
                  </FormFieldWithIcon>
                  
                  <FormFieldWithIcon icon={Percent} label="Shareholding (%)" required>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={promoter.shareholding || ''} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], shareholding: parseFloat(e.target.value) || 0 };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_INPUT} text-sm font-semibold`} 
                      placeholder="0.00" 
                    />
                  </FormFieldWithIcon>
                  
                  <FormFieldWithIcon icon={Phone} label="Mobile" required>
                    <input 
                      value={promoter.mobile} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], mobile: e.target.value };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_INPUT} text-sm`} 
                      placeholder="+91 98765 43210" 
                    />
                  </FormFieldWithIcon>
                  
                  <FormFieldWithIcon icon={Mail} label="Email" required>
                    <input 
                      type="email" 
                      value={promoter.email} 
                      onChange={(e) => {
                        const updated = [...data.promoters];
                        updated[idx] = { ...updated[idx], email: e.target.value };
                        update('promoters', updated);
                      }}
                      className={`${PAPER_INPUT} text-sm`} 
                      placeholder="promoter@email.com" 
                    />
                  </FormFieldWithIcon>
                </div>
              </div>
            );
          })}
        </div>
      </DocumentSection>

      {/* ========================================================
          SECTION 5: COMPLIANCE CERTIFICATES
      ======================================================== */}
      <DocumentSection
        title="5. Compliance & Governance Certificates"
        description="Upload audit certificates for compliance verification"
        icon={Award}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-3">
              Independent Auditors' Certificate on Corporate Governance
            </h5>
            <DocumentUploadZone
              documentType="auditCert"
              title="Upload Audit Certificate"
              description="Certificate confirming compliance with corporate governance norms"
              onUploadComplete={(data) => handleDocumentUpload('auditCert', data)}
              extractedData={documents.auditCert.data}
              isProcessing={documents.auditCert.processing}
              error={documents.auditCert.error}
            />
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-3">
              Certificate of Non-Disqualification of Directors
            </h5>
            <DocumentUploadZone
              documentType="nonDisqualCert"
              title="Upload Non-Disqualification Certificate"
              description="Certificate confirming directors are not disqualified under Companies Act"
              onUploadComplete={(data) => handleDocumentUpload('nonDisqualCert', data)}
              extractedData={documents.nonDisqualCert.data}
              isProcessing={documents.nonDisqualCert.processing}
              error={documents.nonDisqualCert.error}
            />
          </div>
        </div>
      </DocumentSection>

      {/* ========================================================
          CONTACT INFORMATION
      ======================================================== */}
      <DocumentSection
        title="6. Contact & Compliance Information"
        description="Official contact details for IPO communications"
        icon={Phone}
      >
        <div className="grid md:grid-cols-3 gap-5">
          <FormFieldWithIcon icon={Phone} label="Telephone Number" required>
            <input 
              value={data.telephone} 
              onChange={(e) => update('telephone', e.target.value)} 
              className={`${PAPER_INPUT} text-sm`} 
              placeholder="+91 22 1234 5678" 
            />
          </FormFieldWithIcon>
          
          <FormFieldWithIcon icon={Mail} label="Official Email" required>
            <input 
              type="email" 
              value={data.officialEmail} 
              onChange={(e) => update('officialEmail', e.target.value)} 
              className={`${PAPER_INPUT} text-sm`} 
              placeholder="info@company.com" 
            />
          </FormFieldWithIcon>
          
          <FormFieldWithIcon icon={Globe} label="Company Website">
            <input 
              value={data.websiteUrl} 
              onChange={(e) => update('websiteUrl', e.target.value)} 
              className={`${PAPER_INPUT} text-sm`} 
              placeholder="https://www.company.com" 
            />
          </FormFieldWithIcon>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-slate-200">
          <h5 className="text-xs font-bold text-slate-700 mb-4">IPO Compliance Officer</h5>
          <div className="grid md:grid-cols-3 gap-5">
            <FormFieldWithIcon icon={User} label="Full Name" required>
              <input 
                value={data.complianceOfficerName} 
                onChange={(e) => update('complianceOfficerName', e.target.value)} 
                className={`${PAPER_INPUT} text-sm`} 
                placeholder="Officer name" 
              />
            </FormFieldWithIcon>
            
            <FormFieldWithIcon icon={Mail} label="Official Email" required>
              <input 
                type="email" 
                value={data.complianceOfficerEmail} 
                onChange={(e) => update('complianceOfficerEmail', e.target.value)} 
                className={`${PAPER_INPUT} text-sm`} 
                placeholder="officer@company.com" 
              />
            </FormFieldWithIcon>
            
            <FormFieldWithIcon icon={Phone} label="Direct Contact Number" required>
              <input 
                value={data.complianceOfficerPhone} 
                onChange={(e) => update('complianceOfficerPhone', e.target.value)} 
                className={`${PAPER_INPUT} text-sm`} 
                placeholder="+91 98765 43210" 
              />
            </FormFieldWithIcon>
          </div>
        </div>
      </DocumentSection>
    </div>
  );
}