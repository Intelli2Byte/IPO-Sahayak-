export interface Promoter {
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

export interface LogoAsset {
  id: string;
  name: string;
  url: string;
  type:
    | 'issuer'
    | 'brlm'
    | 'registrar'
    | 'legal'
    | 'banker'
    | 'auditor'
    | 'subbrand'
    | 'rating';
  size: number;
  mimeType: string;
}

export interface IntermediaryContact {
  name: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface BRLM {
  id: string;
  entityName: string;
  sebiRegistrationNo: string;
  contactPerson: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: LogoAsset;
}

export interface RegistrarDetails {
  entityName: string;
  sebiRegistrationNo: string;
  contactPerson: string;
  grievanceEmail: string;
  website: string;
  odrPortal: string;
  address: string;
  phone: string;
  logo?: LogoAsset;
}

export interface LegalCounsel {
  id: string;
  role: 'Company Counsel' | 'BRLM Counsel';
  firmName: string;
  address: string;
  phone: string;
  email: string;
  logo?: LogoAsset;
}

export interface BankerDetails {
  id: string;
  bankName: string;
  branchAddress: string;
  contactPerson: string;
  phone: string;
  email: string;
  logo?: LogoAsset;
}

export interface AuditorDetails {
  firmName: string;
  frn: string;
  peerReviewCertificate: string;
  address: string;
  phone: string;
  email: string;
  logo?: LogoAsset;
}

export interface ProductItem {
  name: string;
  description: string;
  revenueContribution: number;
  category: string;
}

export interface SectorBreakdown {
  revenue: number;
  customers: string;
}

export interface MarketChannel {
  label: string;
  checked: boolean;
}

export interface KeyPartner {
  id: string;
  name: string;
  icon: 'company' | 'app';
  locked: boolean;
}

export interface FundingAllocation {
  purpose: string;
  amount: number;
  percentage: number;
}

export interface RiskItem {
  title: string;
  description: string;
  category: string;
}

export interface SellingShareholder {
  name: string;
  category:
    | 'Promoter'
    | 'Promoter Group'
    | 'Public (FPI)'
    | 'Public (DII)'
    | 'Public (Other)';
  preIssueShares: number;
  sharesOffered: number;
}

export interface ESOPDetails {
  active: boolean;
  poolSize: number;
  vestingSchedule: string;
  schemeName: string;
  totalOptionsGranted: number;
  hasConvertibles: 'Yes' | 'No' | '';
}

export interface MaterialContract {
  counterparty: string;
  description: string;
  tenure: string;
  renewalTerms: string;
}

export interface UploadedFileMeta {
  name: string;
  size: number;
  uploadedAt: string;
}

/* =========================================================
   STEP 7 — LEGAL DOCUMENT UPLOAD METADATA
   ========================================================= */

/**
 * Metadata for each legal document upload slot in Step 7.
 */
export interface LegalDocumentUpload {
  id: string;
  label: string;
  required: boolean;
  file: UploadedFileMeta | null;
}

/* =========================================================
   STEP 3 — FINANCIAL DOSSIER TYPES
   ========================================================= */

export interface FinancialDocumentItem {
  id: string;
  label: string;
  required: boolean;
  file: UploadedFileMeta | null;
  reusedFromStep?: number;
}

export interface IndebtednessRecord {
  category: string;
  classification: 'Current' | 'Non-Current' | '';
  amount: number;
  source: string;
  isAiExtracted?: boolean;
}

export interface MdaSection {
  content: string;
  aiDrafted: boolean;
  wordCount: number;
}

export interface CapitalHistoryRecord {
  date: string;
  sharesAllotted: number;
  faceValue: number;
  issuePrice: number;
  considerationType: 'Cash' | 'Bonus' | 'Other' | '';
  isAiExtracted?: boolean;
}

/* =========================================================
   MAIN WIZARD FORM DATA
   ========================================================= */

export interface WizardFormData {
  /* =======================================================
     STEP 1 — CORPORATE IDENTITY
     ======================================================= */

  cin: string;
  companyName: string;
  dateOfIncorporation: string;

  registeredOfficeAddress: string;
  objectClause: string;

  addressBuilding: string;
  addressStreet: string;
  addressLocality: string;
  addressCity: string;
  addressDistrict: string;
  addressState: string;
  addressPinCode: string;

  corporateOfficeDifferent: boolean;
  corporateOfficeAddress: string;

  telephone: string;
  officialEmail: string;
  websiteUrl: string;

  promoterCount: number;
  promoters: Promoter[];

  csName: string;
  csIcsiNumber: string;
  csEmail: string;
  csPhone: string;

  complianceOfficerName: string;
  complianceOfficerEmail: string;
  complianceOfficerPhone: string;

  aoaRestrictiveClauses: 'yes' | 'no' | '';

  brlms: BRLM[];
  registrar: RegistrarDetails;
  legalCounsels: LegalCounsel[];
  bankers: BankerDetails[];
  auditor: AuditorDetails[];

  issuerLogo?: LogoAsset;
  subBrandLogos: LogoAsset[];
  ratingAgencyLogos: LogoAsset[];

  /* =======================================================
     CAPITAL / OFFER STRUCTURE
     ======================================================= */

  authorisedCapital: number;
  paidUpCapital: number;
  promoterShareholdingPercentage: number;
  fiiShareholdingPercentage: number;

  offerStructure:
    | 'Fresh Issue Only'
    | 'Offer for Sale (OFS) Only'
    | 'Fresh Issue + Offer for Sale (OFS)'
    | '';

  proposedShares: number;
  faceValuePerShare: number;
  capPrice: number;
  issueSize: number;

  preIssueTotalShares: number;
  preIssuePromoterShares: number;

  sellingShareholders: SellingShareholder[];

  objectsOfOffer: string;
  objectsOfOfferCategories: string[];
  objectsOfOfferAmounts: Record<string, number>;

  esopDetails: ESOPDetails;

  egmAgmDate: string;
  maxAuthorizedIssueLimit: number;
  ipoAuthorizationDoc: UploadedFileMeta | null;

  capitalStructureDoc1: UploadedFileMeta | null;
  capitalStructureDoc2: UploadedFileMeta | null;
  capitalHistoryRecords: CapitalHistoryRecord[];

  /* =======================================================
     STEP 2 — BUSINESS OVERVIEW
     ======================================================= */

  coreOperationalPillars: string;
  jointVenturesPartnerships: string;
  competitiveNarrative: string;
  proprietaryTechnology: string;

  materialContracts: MaterialContract[];

  businessModel: string;
  usp: string;

  products: ProductItem[];

  sectorsServed: string[];
  sectorBreakdowns: Record<string, SectorBreakdown>;

  capacityValue: number;
  capacityUnit: string;
  capacityUtilization: number;

  boardOfDirectors: string;
  remunerationDetails: string;
  boardCommittees: string;

  executiveAttrition: 'yes' | 'no' | '';
  executiveAttritionExplanation: string;

  remunerationRationale: string;
  employmentTerms: string;

  /* =======================================================
     STEP 3 — FINANCIAL DOSSIER
     ======================================================= */

  consolidatedTotalIncome: number;
  netIncomeFromOperations: number;
  profitAfterTax: number;
  assetsUnderManagement: number;

  fy24Revenue: number;
  fy25Revenue: number;
  fy26Revenue: number;

  fy24Pat: number;
  fy25Pat: number;
  fy26Pat: number;

  totalAssets: number;
  netWorth: number;
  totalDebt: number;

  financialDocuments: FinancialDocumentItem[];
  financialExtractionStatus: 'idle' | 'parsing' | 'done';
  ebitdaMargin: number;
  indebtednessRecords: IndebtednessRecord[];
  mdaSections: Record<string, MdaSection>;
  mdaActiveTab: string;
  kpiEditAudit: Record<string, string>;

  mdaCommentary: string;
  unusualTransactions: string;
  indebtednessSchedule: string;

  attachedDocs: string[];

  /* =======================================================
     STEP 6 — LEGAL / RISK RELATED
     ======================================================= */

  materialCreditorDues: string;
  pendingLitigationDetails: string;
  materialityAssessment: 'Material' | 'Immaterial' | '';

  regulatoryApprovalsConfirmed: boolean;

  litigationsCount: number;
  taxDisputesCount: number;

  hasPendingLitigation: 'yes' | 'no' | '';
  hasRegulatoryAction: 'yes' | 'no' | '';
  hasDefaultHistory: 'yes' | 'no' | '';

  liquidityRiskManagement: string;
  fundingConcentration: string;

  clientSupplierRisk: 'High' | 'Medium' | 'Low' | '';
  regulatoryComplianceRisk: 'High' | 'Medium' | 'Low' | '';
  interestRateCreditRisk: 'High' | 'Medium' | 'Low' | '';
  operationalDependencyRisk: 'High' | 'Medium' | 'Low' | '';

  riskMitigationStrategies: string;

  risks: RiskItem[];

  hasOtherRisks: boolean;
  otherRisksDescription: string;

  secretarialAuditDeclarations: string;
  ceoCfoCertifications: string;

  intermediaryConsent: boolean;

  signatoryName: string;
  signatoryDesignation: string;
  signatoryDin: string;

  declarationAccepted: boolean;
  signatureVerified: boolean;

  esignTriggered: boolean;

  complianceCheck1: boolean;
  complianceCheck2: boolean;
  complianceCheck3: boolean;

  riskExtractionStatus: 'idle' | 'extracting' | 'done';
  contingentLiabilitiesNotAcknowledged: number;
  outstandingIndebtednessFundBased: number;
  materialityThresholdPercent: number;
  materialityThresholdAmount: number;
  relatedPartyRiskEntities: string[];
  cyberTechRiskDescription: string;

  /* =======================================================
     STEP 7 — LEGAL DISCLOSURES (NEW FIELDS)
     ======================================================= */

  legalDisclosuresExtractionStatus: 'idle' | 'extracting' | 'done';
  aggregateTaxDisputesAmount: number;
  defaultComplianceStatus: string;
  aiDraftedLitigationNarrative: string;

  /**
   * Array of legal document upload slots for Step 7.
   */
  legalDocuments: LegalDocumentUpload[];

  /* =======================================================
     STEP 4 — MARKET & MONETIZATION CHANNELS
     ======================================================= */

  marketChannels: MarketChannel[];
  primaryRevenueModel: string;
  marketChannelsContractDoc: UploadedFileMeta | null;
  keyPartners: KeyPartner[];
  aiDraftedNarrative: string;
  targetGeographies: string[];
  revenueDependencyTop5: number;
  customerAcquisitionStrategy: string;

  /* =======================================================
     STEP 5 — USE OF FUNDS
     ======================================================= */

  fundingAllocations: FundingAllocation[];
  totalIssueSize: number;
  useOfFundsExtractionStatus: 'idle' | 'extracting' | 'done';
  useOfFundsNarrative: string;
  capexDeploymentFy2025: number;
  capexDeploymentFy2026: number;
  debtRepaymentBankName: string;
  debtRepaymentAccountNumber: string;
  proceedsForPromoters: boolean;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

export const DEFAULT_MARKET_CHANNELS: MarketChannel[] = [
  { label: 'Direct Institutional Sales (B2B/B2G)', checked: false },
  { label: 'Public Tender & Government E-Procurement', checked: false },
  { label: 'Channel Partners / Authorized Distributors', checked: false },
  { label: 'Export Markets (International Sales)', checked: false },
  { label: 'Digital / E-commerce Storefront', checked: false },
  { label: 'Original Equipment Manufacturer (OEM) Supply', checked: false },
];

export const MDA_TABS = [
  'Results of Operations',
  'Liquidity',
  'Capital Resources',
  'Off-Balance Sheet Items',
] as const;

export const DEFAULT_FINANCIAL_DOCUMENTS: FinancialDocumentItem[] = [
  {
    id: 'fin-doc-1',
    label: 'Restated Consolidated Financial Statements (Audited)',
    required: true,
    file: null,
  },
  {
    id: 'fin-doc-2',
    label: "Independent Auditor's Report",
    required: true,
    file: null,
  },
  {
    id: 'fin-doc-3',
    label: 'Statutory Auditor Peer Review Certificate',
    required: false,
    file: null,
  },
];

/* =========================================================
   STEP 7 — DEFAULT LEGAL DOCUMENTS
   ========================================================= */

export const DEFAULT_LEGAL_DOCUMENTS: LegalDocumentUpload[] = [
  {
    id: 'legal-doc-1',
    label: 'Secretarial Audit Report',
    required: true,
    file: null,
  },
  {
    id: 'legal-doc-2',
    label: 'Integrated Filing — Governance & Compliance Report',
    required: true,
    file: null,
  },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const RELATED_PARTY_OPTIONS = [
  'Reliance Retail Limited',
  'Summit Digitel Infrastructure',
  'Jio Digital Fibre Private Limited',
  'Reliance Jio Infocomm Limited',
  'Reliance Industries Limited',
  'Jio Platforms Limited',
];

export const DEFAULT_WIZARD_DATA: WizardFormData = {
  cin: '',
  companyName: '',
  dateOfIncorporation: '',
  registeredOfficeAddress: '',
  objectClause: '',
  addressBuilding: '',
  addressStreet: '',
  addressLocality: '',
  addressCity: '',
  addressDistrict: '',
  addressState: 'Maharashtra',
  addressPinCode: '',
  corporateOfficeDifferent: false,
  corporateOfficeAddress: '',
  telephone: '',
  officialEmail: '',
  websiteUrl: '',
  promoterCount: 1,
  promoters: [
    {
      name: '',
      type: 'Individual Person',
      pan: '',
      din: '',
      experience: 0,
      background: '',
      shareholding: 0,
      mobile: '',
      email: '',
      address: '',
    },
  ],
  csName: '',
  csIcsiNumber: '',
  csEmail: '',
  csPhone: '',
  complianceOfficerName: '',
  complianceOfficerEmail: '',
  complianceOfficerPhone: '',
  aoaRestrictiveClauses: '',
  brlms: [
    {
      id: 'brlm-1',
      entityName: '',
      sebiRegistrationNo: '',
      contactPerson: '',
      designation: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    },
  ],
  registrar: {
    entityName: '',
    sebiRegistrationNo: '',
    contactPerson: '',
    grievanceEmail: '',
    website: '',
    odrPortal: '',
    address: '',
    phone: '',
  },
  legalCounsels: [
    {
      id: 'legal-1',
      role: 'Company Counsel',
      firmName: '',
      address: '',
      phone: '',
      email: '',
    },
    {
      id: 'legal-2',
      role: 'BRLM Counsel',
      firmName: '',
      address: '',
      phone: '',
      email: '',
    },
  ],
  bankers: [],
  auditor: {
    firmName: '',
    frn: '',
    peerReviewCertificate: '',
    address: '',
    phone: '',
    email: '',
  },
  issuerLogo: undefined,
  subBrandLogos: [],
  ratingAgencyLogos: [],
  authorisedCapital: 0,
  paidUpCapital: 0,
  promoterShareholdingPercentage: 0,
  fiiShareholdingPercentage: 0,
  offerStructure: '',
  proposedShares: 0,
  faceValuePerShare: 0,
  capPrice: 0,
  issueSize: 0,
  preIssueTotalShares: 0,
  preIssuePromoterShares: 0,
  sellingShareholders: [],
  objectsOfOffer: '',
  objectsOfOfferCategories: [],
  objectsOfOfferAmounts: {},
  esopDetails: {
    poolSize: 0,
    vestingSchedule: '',
    active: false,
    schemeName: '',
    totalOptionsGranted: 0,
    hasConvertibles: '',
  },
  egmAgmDate: '',
  maxAuthorizedIssueLimit: 0,
  ipoAuthorizationDoc: null,
  capitalStructureDoc1: null,
  capitalStructureDoc2: null,
  capitalHistoryRecords: [],
  coreOperationalPillars: '',
  jointVenturesPartnerships: '',
  competitiveNarrative: '',
  proprietaryTechnology: '',
  materialContracts: [],
  businessModel: '',
  usp: '',
  products: [
    {
      name: '',
      description: '',
      revenueContribution: 0,
      category: 'Financial Services',
    },
  ],
  sectorsServed: [],
  sectorBreakdowns: {},
  capacityValue: 0,
  capacityUnit: 'Customers / month',
  capacityUtilization: 0,
  boardOfDirectors: '',
  remunerationDetails: '',
  boardCommittees: '',
  executiveAttrition: '',
  executiveAttritionExplanation: '',
  remunerationRationale: '',
  employmentTerms: '',
  consolidatedTotalIncome: 0,
  netIncomeFromOperations: 0,
  profitAfterTax: 0,
  assetsUnderManagement: 0,
  fy24Revenue: 0,
  fy25Revenue: 0,
  fy26Revenue: 0,
  fy24Pat: 0,
  fy25Pat: 0,
  fy26Pat: 0,
  totalAssets: 0,
  netWorth: 0,
  totalDebt: 0,
  financialDocuments: DEFAULT_FINANCIAL_DOCUMENTS,
  financialExtractionStatus: 'idle',
  ebitdaMargin: 0,
  indebtednessRecords: [],
  mdaSections: {},
  mdaActiveTab: MDA_TABS[0],
  kpiEditAudit: {},
  mdaCommentary: '',
  unusualTransactions: '',
  indebtednessSchedule: '',
  attachedDocs: [],
  materialCreditorDues: '',
  pendingLitigationDetails: '',
  materialityAssessment: '',
  regulatoryApprovalsConfirmed: false,
  litigationsCount: 0,
  taxDisputesCount: 0,
  hasPendingLitigation: '',
  hasRegulatoryAction: '',
  hasDefaultHistory: '',
  liquidityRiskManagement: '',
  fundingConcentration: '',
  clientSupplierRisk: '',
  regulatoryComplianceRisk: '',
  interestRateCreditRisk: '',
  operationalDependencyRisk: '',
  riskMitigationStrategies: '',
  risks: [
    {
      title: 'Client / Supplier Concentration Risk',
      description: '',
      category: 'Concentration',
    },
    {
      title: 'Regulatory & Compliance Delay Risk',
      description: '',
      category: 'Regulatory',
    },
    {
      title: 'Interest Rate & Credit Risk',
      description: '',
      category: 'Financial',
    },
    {
      title: 'Operational Dependency Risk',
      description: '',
      category: 'Operational',
    },
  ],
  hasOtherRisks: false,
  otherRisksDescription: '',
  secretarialAuditDeclarations: '',
  ceoCfoCertifications: '',
  intermediaryConsent: false,
  signatoryName: '',
  signatoryDesignation: '',
  signatoryDin: '',
  declarationAccepted: false,
  signatureVerified: false,
  esignTriggered: false,
  complianceCheck1: false,
  complianceCheck2: false,
  complianceCheck3: false,
  riskExtractionStatus: 'idle',
  contingentLiabilitiesNotAcknowledged: 0,
  outstandingIndebtednessFundBased: 0,
  materialityThresholdPercent: 1,
  materialityThresholdAmount: 0,
  relatedPartyRiskEntities: [],
  cyberTechRiskDescription: '',
  legalDisclosuresExtractionStatus: 'idle',
  aggregateTaxDisputesAmount: 0,
  defaultComplianceStatus: '',
  aiDraftedLitigationNarrative: '',
  legalDocuments: DEFAULT_LEGAL_DOCUMENTS,
  marketChannels: DEFAULT_MARKET_CHANNELS,
  primaryRevenueModel: '',
  marketChannelsContractDoc: null,
  keyPartners: [],
  aiDraftedNarrative: '',
  targetGeographies: [],
  revenueDependencyTop5: 0,
  customerAcquisitionStrategy: '',
  fundingAllocations: [
    { purpose: 'Capital Expenditure', amount: 8000000, percentage: 40 },
    { purpose: 'Working Capital Requirements', amount: 6000000, percentage: 30 },
    { purpose: 'Debt Repayment', amount: 4000000, percentage: 20 },
    { purpose: 'General Corporate Purposes', amount: 2000000, percentage: 10 },
  ],
  totalIssueSize: 20000000,
  useOfFundsExtractionStatus: 'idle',
  useOfFundsNarrative: '',
  capexDeploymentFy2025: 0,
  capexDeploymentFy2026: 0,
  debtRepaymentBankName: '',
  debtRepaymentAccountNumber: '',
  proceedsForPromoters: false,
};

export const PAPER_INPUT =
  'w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-md bg-[#fffdf8] focus:border-primary focus:outline-none font-bold text-slate-800 transition-colors placeholder:text-slate-350 placeholder:font-semibold';

export const PAPER_SELECT =
  'w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-md bg-[#fffdf8] focus:border-primary focus:outline-none font-bold text-slate-700';

export const PAPER_TEXTAREA =
  'w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-md bg-[#fffdf8] focus:border-primary focus:outline-none font-semibold text-slate-800 leading-relaxed';