// ============= INTERFACES =============

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  avatar: string;
  companyId: string;
  joinedDate: string;
  lastLogin: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: string;
  twoFactorEnabled: boolean;
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    dashboardLayout: string;
  };
}

export interface CompanyDetails {
  id: string;
  legalName: string;
  brandName: string;
  cin: string;
  pan: string;
  gstin: string;
  incorporationDate: string;
  registeredAddress: Address;
  corporateAddress: Address;
  industry: string;
  sector: string;
  subSector: string;
  businessModel: string;
  companySize: string;
  employeeCount: number;
  website: string;
  logo: string;
  foundedYear: number;
  description: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
  contactEmail: string;
  contactPhone: string;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UseOfProceedsItem {
  purpose: string;
  amount: number;
  percentage: number;
}

export interface StepProgressItem {
  stepNumber: number;
  stepName: string;
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
  progress: number;
  completedAt: string | null;
  fields: number;
  completedFields: number;
}

export interface TeamMember {
  userId: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface IPOApplication {
  id: string;
  companyId: string;
  applicationNumber: string;
  status: string;
  overallProgress: number;
  currentStep: number;
  totalSteps: number;
  createdAt: string;
  lastUpdatedAt: string;
  submittedAt: string | null;
  targetListingDate: string;
  estimatedDaysToCompletion: number;
  ipoDetails: {
    issueType: string;
    freshIssueSize: number;
    ofsSize: number;
    totalIssueSize: number;
    priceRange: {
      floor: number;
      cap: number;
    };
    lotSize: number;
    minimumInvestment: number;
    issueOpenDate: string;
    issueCloseDate: string;
    listingDate: string;
    exchange: string;
    isinNumber: string | null;
    useOfProceeds: UseOfProceedsItem[];
  };
  stepProgress: StepProgressItem[];
  team: TeamMember[];
}

export interface QuickStat {
  id: string;
  label: string;
  value: number;
  total?: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  description: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  icon: string;
  color: string;
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'not_started' | 'completed';
  assignedTo: string;
  daysRemaining: number;
}

export interface CategoryProgress {
  category: string;
  progress: number;
  status: string;
  color: string;
}

export interface DashboardStats {
  overview: {
    applicationProgress: number;
    documentsUploaded: number;
    totalDocumentsRequired: number;
    complianceScore: number;
    pendingTasks: number;
    completedTasks: number;
    daysToDeadline: number;
    lastActivity: string;
  };
  quickStats: QuickStat[];
  recentActivity: RecentActivity[];
  upcomingDeadlines: Deadline[];
  progressByCategory: CategoryProgress[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  type: 'query' | 'reply' | 'note';
}

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'approved' | 'under_review' | 'pending' | 'rejected';
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  comments: Comment[];
  url: string;
  thumbnail?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  required: number;
  uploaded: number;
  approved: number;
  pending: number;
  rejected: number;
  documents: DocumentItem[];
}

export interface DocumentVault {
  categories: DocumentCategory[];
  summary: {
    totalRequired: number;
    totalUploaded: number;
    totalApproved: number;
    totalPending: number;
    totalUnderReview: number;
    totalRejected: number;
    completionPercentage: number;
  };
}

export interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completedDate: string | null;
  assignedTo: string;
  documents: string[];
  notes: string;
}

export interface ComplianceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  items: ComplianceItem[];
}

export interface ComplianceTracker {
  overallScore: number;
  categories: ComplianceCategory[];
}

// ============= MOCK DATA EXPORTS =============

export const mockUserProfile: UserProfile = {
  id: "usr_2026_001",
  firstName: "Isha",
  lastName: "Ambani",
  fullName: "Isha Ambani",
  email: "isha.ambani@ril.com",
  phone: "+91 98765 43210",
  role: "director",
  designation: "Board of Directors",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  companyId: "comp_reliance_jio_001",
  joinedDate: "2025-01-15T10:30:00Z",
  lastLogin: "2026-08-09T08:20:29Z",
  emailVerified: true,
  phoneVerified: true,
  kycStatus: "verified",
  twoFactorEnabled: true,
  preferences: {
    theme: "light",
    language: "en",
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    dashboardLayout: "default",
  },
};

export const mockCompanyDetails: CompanyDetails = {
  id: "comp_reliance_jio_001",
  legalName: "Reliance Jio Infocomm Limited",
  brandName: "Reliance Jio",
  cin: "U72900MH2007PLC164180",
  pan: "AABCR5547E",
  gstin: "27AABCR5547E1Z5",
  incorporationDate: "2007-02-15",
  registeredAddress: {
    line1: "Reliance Corporate Park",
    line2: "Thane Belapur Road, Ghansoli",
    city: "Navi Mumbai",
    state: "Maharashtra",
    pincode: "400701",
    country: "India",
  },
  corporateAddress: {
    line1: "Maker Chambers IV, 3rd Floor",
    line2: "222, Nariman Point",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400021",
    country: "India",
  },
  industry: "Telecommunications",
  sector: "Technology & Telecom",
  subSector: "Digital Services",
  businessModel: "B2C Telecom & Digital Services",
  companySize: "large",
  employeeCount: 25000,
  website: "https://www.jio.com",
  logo: "/logos/jio-logo.png",
  foundedYear: 2007,
  description:
    "India's largest telecom operator providing 4G/5G services, digital platforms, and enterprise solutions.",
  socialMedia: {
    linkedin: "https://linkedin.com/company/reliance-jio",
    twitter: "https://twitter.com/reliancejio",
    instagram: "https://instagram.com/reliancejio",
    facebook: "https://facebook.com/reliancejio",
  },
  contactEmail: "info@jio.com",
  contactPhone: "+91 22 6666 3333",
};

export const mockIpoApplication: IPOApplication = {
  id: "ipo_app_2026_jio_001",
  companyId: "comp_reliance_jio_001",
  applicationNumber: "IPO/2026/SME/001234",
  status: "in_progress",
  overallProgress: 67,
  currentStep: 5,
  totalSteps: 8,
  createdAt: "2025-02-01T09:00:00Z",
  lastUpdatedAt: "2026-08-09T08:20:29Z",
  submittedAt: null,
  targetListingDate: "2026-12-15",
  estimatedDaysToCompletion: 45,
  ipoDetails: {
    issueType: "Fresh Issue + OFS",
    freshIssueSize: 15000000,
    ofsSize: 5000000,
    totalIssueSize: 20000000,
    priceRange: {
      floor: 85,
      cap: 95,
    },
    lotSize: 150,
    minimumInvestment: 12750,
    issueOpenDate: "2026-12-10",
    issueCloseDate: "2026-12-12",
    listingDate: "2026-12-15",
    exchange: "BSE SME",
    isinNumber: null,
    useOfProceeds: [
      {
        purpose: "Expansion of network infrastructure",
        amount: 8000000,
        percentage: 40,
      },
      {
        purpose: "Technology & Platform upgrade",
        amount: 5000000,
        percentage: 25,
      },
      {
        purpose: "Working capital requirements",
        amount: 4000000,
        percentage: 20,
      },
      {
        purpose: "General corporate purposes",
        amount: 3000000,
        percentage: 15,
      },
    ],
  },
  stepProgress: [
    {
      stepNumber: 1,
      stepName: "Company Information",
      status: "completed",
      progress: 100,
      completedAt: "2025-02-05T14:30:00Z",
      fields: 25,
      completedFields: 25,
    },
    {
      stepNumber: 2,
      stepName: "Promoter Details",
      status: "completed",
      progress: 100,
      completedAt: "2025-02-10T11:20:00Z",
      fields: 18,
      completedFields: 18,
    },
    {
      stepNumber: 3,
      stepName: "Financial Information",
      status: "completed",
      progress: 100,
      completedAt: "2025-02-20T16:45:00Z",
      fields: 32,
      completedFields: 32,
    },
    {
      stepNumber: 4,
      stepName: "Business Model & Operations",
      status: "completed",
      progress: 100,
      completedAt: "2025-03-01T10:15:00Z",
      fields: 22,
      completedFields: 22,
    },
    {
      stepNumber: 5,
      stepName: "Use of Funds & Projections",
      status: "in_progress",
      progress: 75,
      completedAt: null,
      fields: 20,
      completedFields: 15,
    },
    {
      stepNumber: 6,
      stepName: "Risk Factors & Disclosures",
      status: "not_started",
      progress: 0,
      completedAt: null,
      fields: 15,
      completedFields: 0,
    },
    {
      stepNumber: 7,
      stepName: "Legal & Compliance",
      status: "not_started",
      progress: 0,
      completedAt: null,
      fields: 28,
      completedFields: 0,
    },
    {
      stepNumber: 8,
      stepName: "Review & Submit",
      status: "locked",
      progress: 0,
      completedAt: null,
      fields: 1,
      completedFields: 0,
    },
  ],
  team: [
    {
      userId: "usr_2026_001",
      name: "Isha Ambani",
      role: "Board of Directors",
      permissions: ["view", "edit", "submit", "share_document"],
    },
    {
      userId: "usr_2026_002",
      name: "Akash Ambani",
      role: "Chairman",
      permissions: ["view", "edit"],
    },
    {
      userId: "usr_2026_003",
      name: "Anshuman Thakur",
      role: "Head of Strategy",
      permissions: ["view"],
    },
  ],
};

export const mockDashboardStats: DashboardStats = {
  overview: {
    applicationProgress: 67,
    documentsUploaded: 27,
    totalDocumentsRequired: 35,
    complianceScore: 82,
    pendingTasks: 8,
    completedTasks: 47,
    daysToDeadline: 45,
    lastActivity: "2026-08-09T08:20:29Z",
  },
  quickStats: [
    {
      id: "stat_1",
      label: "Application Progress",
      value: 67,
      unit: "%",
      change: 5,
      changeType: "increase",
      icon: "TrendingUp",
      color: "blue",
      description: "Overall completion status",
    },
    {
      id: "stat_2",
      label: "Documents Uploaded",
      value: 27,
      total: 35,
      unit: "docs",
      change: 3,
      changeType: "increase",
      icon: "FileText",
      color: "emerald",
      description: "Required documents submitted",
    },
    {
      id: "stat_3",
      label: "Compliance Score",
      value: 82,
      unit: "%",
      change: 2,
      changeType: "increase",
      icon: "Shield",
      color: "purple",
      description: "Regulatory compliance status",
    },
    {
      id: "stat_4",
      label: "Advisor Review Phase",
      value: 2,
      total: 3,
      unit: "Phase",
      change: 1,
      changeType: "increase",
      icon: "Scale",
      color: "amber",
      description: "Under MB & CA Audits",
    },
  ],
  recentActivity: [
    {
      id: "act_001",
      type: "document_upload",
      title: "Financial Statement FY25-26 uploaded",
      description: "Balance Sheet and P&L uploaded successfully",
      timestamp: "2026-08-09T08:15:00Z",
      user: "Isha Ambani",
      icon: "Upload",
      color: "emerald",
    },
    {
      id: "act_002",
      type: "form_update",
      title: "Use of Funds section updated",
      description: "Added detailed breakdown of capital expenditure",
      timestamp: "2026-08-08T14:20:00Z",
      user: "Isha Ambani",
      icon: "Edit",
      color: "blue",
    },
    {
      id: "act_003",
      type: "comment",
      title: "New comment from reviewer",
      description: "Clarification needed on revenue projections",
      timestamp: "2026-08-07T11:30:00Z",
      user: "SEBI Reviewer",
      icon: "MessageSquare",
      color: "amber",
    },
    {
      id: "act_004",
      type: "approval",
      title: "Promoter KYC approved",
      description: "All promoter documents verified successfully",
      timestamp: "2026-08-06T15:10:00Z",
      user: "System",
      icon: "CheckCircle",
      color: "emerald",
    },
    {
      id: "act_005",
      type: "task_complete",
      title: "Board resolution uploaded",
      description: "Resolution for IPO approval added to documents",
      timestamp: "2026-08-05T10:45:00Z",
      user: "Isha Ambani",
      icon: "Check",
      color: "emerald",
    },
  ],
  upcomingDeadlines: [
    {
      id: "deadline_001",
      title: "Complete Risk Factors section",
      dueDate: "2026-08-15T23:59:59Z",
      priority: "high",
      status: "pending",
      assignedTo: "Isha Ambani",
      daysRemaining: 6,
    },
    {
      id: "deadline_002",
      title: "Upload Auditor's Report FY25-26",
      dueDate: "2026-08-18T23:59:59Z",
      priority: "high",
      status: "pending",
      assignedTo: "Akash Ambani",
      daysRemaining: 9,
    },
    {
      id: "deadline_003",
      title: "Submit Legal Opinion",
      dueDate: "2026-08-22T23:59:59Z",
      priority: "medium",
      status: "in_progress",
      assignedTo: "Anshuman Thakur",
      daysRemaining: 13,
    },
    {
      id: "deadline_004",
      title: "Complete Due Diligence Questionnaire",
      dueDate: "2026-08-25T23:59:59Z",
      priority: "medium",
      status: "not_started",
      assignedTo: "Isha Ambani",
      daysRemaining: 16,
    },
  ],
  progressByCategory: [
    {
      category: "Company Information",
      progress: 100,
      status: "completed",
      color: "emerald",
    },
    {
      category: "Financial Data",
      progress: 85,
      status: "in_progress",
      color: "blue",
    },
    {
      category: "Legal Documents",
      progress: 75,
      status: "in_progress",
      color: "amber",
    },
    {
      category: "Compliance Documents",
      progress: 80,
      status: "in_progress",
      color: "purple",
    },
    {
      category: "Due Diligence Docs",
      progress: 30,
      status: "in_progress",
      color: "red",
    },
  ],
};

export const mockDocumentVault: DocumentVault = {
  categories: [
    {
      id: "cat_financial",
      name: "Financial Documents",
      icon: "DollarSign",
      color: "emerald",
      required: 8,
      uploaded: 6,
      approved: 5,
      pending: 1,
      rejected: 0,
      documents: [
        {
          id: "doc_001",
          name: "Audited Financial Statements FY 2025-26",
          fileName: "Consolidated Balance Sheet jio.pdf",
          fileSize: 2458624,
          fileType: "application/pdf",
          uploadedAt: "2026-03-15T10:30:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-18T14:20:00Z",
          comments: [],
          url: "/uploads/documents/Consolidated Balance Sheet jio.pdf",
          thumbnail: "/thumbnails/doc_001.jpg",
        },
        {
          id: "doc_002",
          name: "Consolidated Statement of Profit and Loss FY 2025-26",
          fileName: "Consolidated Statement of Profit and Loss.pdf",
          fileSize: 2234567,
          fileType: "application/pdf",
          uploadedAt: "2026-03-15T10:35:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-18T14:25:00Z",
          comments: [],
          url: "/uploads/documents/Consolidated Statement of Profit and Loss.pdf",
          thumbnail: "/thumbnails/doc_002.jpg",
        },
        {
          id: "doc_003",
          name: "Consolidated Statement of Cash Flow FY 2025-26",
          fileName: "Consolidated Statement of Cash Flow.pdf",
          fileSize: 1567890,
          fileType: "application/pdf",
          uploadedAt: "2026-03-20T11:15:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          comments: [],
          url: "/uploads/documents/Consolidated Statement of Cash Flow.pdf",
          thumbnail: "/thumbnails/doc_003.jpg",
        },
        {
          id: "doc_004",
          name: "Consolidated Statement of Changes in Equity FY 2025-26",
          fileName: "Consolidated Statement of Changes in Equity.pdf",
          fileSize: 3456789,
          fileType: "application/pdf",
          uploadedAt: "2026-03-18T15:45:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-20T10:15:00Z",
          comments: [],
          url: "/uploads/documents/Consolidated Statement of Changes in Equity.pdf",
          thumbnail: "/thumbnails/doc_004.jpg",
        },
        {
          id: "doc_005",
          name: "Investments Portfolio FY 2025-26",
          fileName: "investments jio.pdf",
          fileSize: 4567890,
          fileType: "application/pdf",
          uploadedAt: "2026-03-19T09:20:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-21T11:30:00Z",
          comments: [],
          url: "/uploads/documents/investments jio.pdf",
          thumbnail: "/thumbnails/doc_005.jpg",
        },
        {
          id: "doc_006",
          name: "Deferred Tax Assets (Net) FY 2025-26",
          fileName: "Deferred tax assets (net).pdf",
          fileSize: 1890123,
          fileType: "application/pdf",
          uploadedAt: "2026-03-25T14:10:00Z",
          uploadedBy: "Isha Ambani",
          status: "pending",
          version: 1,
          comments: [],
          url: "/uploads/documents/Deferred tax assets (net).pdf",
          thumbnail: "/thumbnails/doc_006.jpg",
        },
      ],
    },
    {
      id: "cat_legal",
      name: "Legal Documents",
      icon: "Scale",
      color: "blue",
      required: 12,
      uploaded: 9,
      approved: 7,
      pending: 2,
      rejected: 0,
      documents: [
        {
          id: "doc_101",
          name: "Certificate of Incorporation",
          fileName: "Certificate of Incorporation.pdf",
          fileSize: 567890,
          fileType: "application/pdf",
          uploadedAt: "2026-02-10T10:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-12T14:00:00Z",
          comments: [],
          url: "/uploads/documents/Certificate of Incorporation.pdf",
          thumbnail: "/thumbnails/doc_101.jpg",
        },
        {
          id: "doc_102",
          name: "Memorandum of Association (MOA)",
          fileName: "Memorandum of Association.pdf",
          fileSize: 890123,
          fileType: "application/pdf",
          uploadedAt: "2026-02-10T10:15:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-12T14:15:00Z",
          comments: [],
          url: "/uploads/documents/Memorandum of Association.pdf",
          thumbnail: "/thumbnails/doc_102.jpg",
        },
        {
          id: "doc_103",
          name: "CIN and Registered Address",
          fileName: "simple cin and registered address.pdf",
          fileSize: 1234567,
          fileType: "application/pdf",
          uploadedAt: "2026-02-10T10:30:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-12T14:30:00Z",
          comments: [],
          url: "/uploads/documents/simple cin and registered address.pdf",
          thumbnail: "/thumbnails/doc_103.jpg",
        },
        {
          id: "doc_104",
          name: "Statement Pursuant to Section 102(1) of Companies Act 2013",
          fileName:
            "legal STATEMENT PURSUANT TO SECTION 102(1) OF THE COMPANIES ACT, 2013 AND.pdf",
          fileSize: 456789,
          fileType: "application/pdf",
          uploadedAt: "2026-02-15T11:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-17T10:00:00Z",
          comments: [],
          url:
            "/uploads/documents/legal STATEMENT PURSUANT TO SECTION 102(1) OF THE COMPANIES ACT, 2013 AND.pdf",
          thumbnail: "/thumbnails/doc_104.jpg",
        },
        {
          id: "doc_105",
          name: "Policies and Government Compliance",
          fileName: "policies and government.pdf",
          fileSize: 2345678,
          fileType: "application/pdf",
          uploadedAt: "2026-02-18T14:30:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-20T11:00:00Z",
          comments: [],
          url: "/uploads/documents/policies and government.pdf",
          thumbnail: "/thumbnails/doc_105.jpg",
        },
        {
          id: "doc_106",
          name: "Definitions Document",
          fileName: "DEFINITIONS of jio document.pdf",
          fileSize: 234567,
          fileType: "application/pdf",
          uploadedAt: "2026-02-10T09:45:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-12T13:45:00Z",
          comments: [],
          url: "/uploads/documents/DEFINITIONS of jio document.pdf",
          thumbnail: "/thumbnails/doc_106.jpg",
        },
        {
          id: "doc_107",
          name: "Secretarial Audit Report FY 2025-26",
          fileName: "SECRETARIAL AUDIT REPORT.pdf",
          fileSize: 345678,
          fileType: "application/pdf",
          uploadedAt: "2026-02-10T09:50:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-12T13:50:00Z",
          comments: [],
          url: "/uploads/documents/SECRETARIAL AUDIT REPORT.pdf",
          thumbnail: "/thumbnails/doc_107.jpg",
        },
        {
          id: "doc_108",
          name: "Annexure I - Form AOC-2",
          fileName: "Annexure I form no AOC2 .pdf",
          fileSize: 1567890,
          fileType: "application/pdf",
          uploadedAt: "2026-02-22T10:30:00Z",
          uploadedBy: "Isha Ambani",
          status: "under_review",
          version: 1,
          comments: [
            {
              id: "comment_108",
              author: "SEBI Reviewer",
              text:
                "Please verify the related party transaction disclosures match the audited financials.",
              timestamp: "2026-02-24T09:30:00Z",
              type: "query",
            },
          ],
          url: "/uploads/documents/Annexure I form no AOC2 .pdf",
          thumbnail: "/thumbnails/doc_108.jpg",
        },
        {
          id: "doc_109",
          name: "CEO-CFO Certificate",
          fileName: "CEO-CFO Certificate.pdf",
          fileSize: 3456789,
          fileType: "application/pdf",
          uploadedAt: "2026-02-25T15:20:00Z",
          uploadedBy: "Isha Ambani",
          status: "pending",
          version: 1,
          comments: [],
          url: "/uploads/documents/CEO-CFO Certificate.pdf",
          thumbnail: "/thumbnails/doc_109.jpg",
        },
      ],
    },
    {
      id: "cat_promoter",
      name: "Promoter & Capital Structure Documents",
      icon: "Users",
      color: "purple",
      required: 10,
      uploaded: 8,
      approved: 8,
      pending: 0,
      rejected: 0,
      documents: [
        {
          id: "doc_201",
          name: "Capital Structure & Our Promoters",
          fileName: "Capital Structure & Our Promoters.pdf",
          fileSize: 1234567,
          fileType: "application/pdf",
          uploadedAt: "2026-02-08T10:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-10T14:00:00Z",
          comments: [],
          url:
            "/uploads/documents/Capital Structure & Our Promoters.pdf",
          thumbnail: "/thumbnails/doc_201.jpg",
        },
        {
          id: "doc_202",
          name: "Capital Structure - Mutual Fund Holdings",
          fileName: "CAPITAL STRUCTURE mutual fund.pdf",
          fileSize: 234567,
          fileType: "application/pdf",
          uploadedAt: "2026-02-08T10:05:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-10T14:05:00Z",
          comments: [],
          url:
            "/uploads/documents/CAPITAL STRUCTURE mutual fund.pdf",
          thumbnail: "/thumbnails/doc_202.jpg",
        },
        {
          id: "doc_203",
          name: "Capital Structure - Mutual Fund New Holdings",
          fileName: "CAPITAL STRUCTURE mutual fund and their new.pdf",
          fileSize: 345678,
          fileType: "application/pdf",
          uploadedAt: "2026-02-08T10:10:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-10T14:10:00Z",
          comments: [],
          url:
            "/uploads/documents/CAPITAL STRUCTURE mutual fund and their new.pdf",
          thumbnail: "/thumbnails/doc_203.jpg",
        },
        {
          id: "doc_204",
          name: "Capital Structure and Promoters Shareholding",
          fileName: "CAPITAL STRUCTURE and promotors share holding.pdf",
          fileSize: 456789,
          fileType: "application/pdf",
          uploadedAt: "2026-02-08T10:15:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-10T14:15:00Z",
          comments: [],
          url:
            "/uploads/documents/CAPITAL STRUCTURE and promotors share holding.pdf",
          thumbnail: "/thumbnails/doc_204.jpg",
        },
        {
          id: "doc_205",
          name: "Summary Statement - Pre-Issue Specified Securities",
          fileName:
            "Summary Statement holding of specified securities pre issue.pdf",
          fileSize: 1567890,
          fileType: "application/pdf",
          uploadedAt: "2026-02-08T10:20:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-10T14:20:00Z",
          comments: [],
          url:
            "/uploads/documents/Summary Statement holding of specified securities pre issue.pdf",
          thumbnail: "/thumbnails/doc_205.jpg",
        },
        {
          id: "doc_206",
          name: "Cash and Cash Equivalents",
          fileName: "cash and cash equivalents .pdf",
          fileSize: 123456,
          fileType: "application/pdf",
          uploadedAt: "2026-02-08T10:25:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-10T14:25:00Z",
          comments: [],
          url:
            "/uploads/documents/cash and cash equivalents .pdf",
          thumbnail: "/thumbnails/doc_206.jpg",
        },
        {
          id: "doc_207",
          name: "Capital Work-in-Progress",
          fileName: "Capital Work-in-Progress.png",
          fileSize: 567890,
          fileType: "image/png",
          uploadedAt: "2026-02-12T11:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-14T10:00:00Z",
          comments: [],
          url:
            "/uploads/documents/Capital Work-in-Progress.png",
          thumbnail: "/thumbnails/doc_207.jpg",
        },
        {
          id: "doc_208",
          name: "Derivative Financial Instruments",
          fileName: "Derivative Financial Instruments.png",
          fileSize: 345678,
          fileType: "image/png",
          uploadedAt: "2026-02-12T11:30:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-02-14T10:30:00Z",
          comments: [],
          url:
            "/uploads/documents/Derivative Financial Instruments.png",
          thumbnail: "/thumbnails/doc_208.jpg",
        },
      ],
    },
    {
      id: "cat_compliance",
      name: "Compliance Certificates",
      icon: "Shield",
      color: "amber",
      required: 5,
      uploaded: 4,
      approved: 3,
      pending: 1,
      rejected: 0,
      documents: [
        {
          id: "doc_301",
          name:
            "Annexure II - Annual Report on CSR Activities FY 2025-26",
          fileName:
            "Annexure II Annual Report on CSR Activities (FY 2025-26).pdf",
          fileSize: 678901,
          fileType: "application/pdf",
          uploadedAt: "2026-03-10T14:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-12T10:00:00Z",
          comments: [],
          url:
            "/uploads/documents/Annexure II Annual Report on CSR Activities (FY 2025-26).pdf",
          thumbnail: "/thumbnails/doc_301.jpg",
        },
        {
          id: "doc_302",
          name: "Independent Auditors Certificate on Compliance",
          fileName:
            "Independent Auditors' Certificate on Compliance with conditions of.pdf",
          fileSize: 567890,
          fileType: "application/pdf",
          uploadedAt: "2026-03-11T14:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-13T10:00:00Z",
          comments: [],
          url:
            "/uploads/documents/Independent Auditors' Certificate on Compliance with conditions of.pdf",
          thumbnail: "/thumbnails/doc_302.jpg",
        },
        {
          id: "doc_303",
          name: "Certificate of Non-Disqualification",
          fileName: "CERTIFICATE OF NON-DISQUALIFICATION.png",
          fileSize: 456789,
          fileType: "image/png",
          uploadedAt: "2026-03-12T14:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2026-03-14T10:00:00Z",
          comments: [],
          url:
            "/uploads/documents/CERTIFICATE OF NON-DISQUALIFICATION.png",
          thumbnail: "/thumbnails/doc_303.jpg",
        },
        {
          id: "doc_304",
          name: "SEBI Regulations Compliance Certificate",
          fileName: "SEBI_Compliance_Cert.pdf",
          fileSize: 345678,
          fileType: "application/pdf",
          uploadedAt: "2026-03-15T14:00:00Z",
          uploadedBy: "Isha Ambani",
          status: "pending",
          version: 1,
          comments: [],
          url: "/uploads/documents/SEBI_Compliance_Cert.pdf",
          thumbnail: "/thumbnails/doc_304.jpg",
        },
      ],
    },
  ],

  summary: {
    totalRequired: 35,
    totalUploaded: 30,
    totalApproved: 30,
    totalPending: 0,
    totalUnderReview: 0,
    totalRejected: 0,
    completionPercentage: 86,
  },
};

export const mockComplianceTracker: ComplianceTracker = {
  overallScore: 86,

  categories: [
    {
      id: "comp_sebi",
      name: "SEBI Regulations",
      icon: "Shield",
      color: "blue",
      progress: 85,
      totalItems: 10,
      completedItems: 7,
      items: [
        {
          id: "sebi_001",
          title: "SEBI (ICDR) Regulations, 2018 - Chapter XB",
          description: "Compliance with SME platform listing requirements",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-15T14:30:00Z",
          assignedTo: "Isha Ambani",
          documents: ["doc_301"],
          notes: "All requirements met as per SEBI guidelines",
        },
        {
          id: "sebi_002",
          title: "Minimum Promoter Contribution (20%)",
          description: "Ensure promoters hold minimum 20% post-issue",
          status: "completed",
          priority: "high",
          dueDate: "2026-04-15T23:59:59Z",
          completedDate: "2026-03-20T11:00:00Z",
          assignedTo: "Isha Ambani",
          documents: [],
          notes: "Promoter holding: 65% pre-issue, 52% post-issue",
        },
        {
          id: "sebi_003",
          title: "Track Record Requirement (3 years)",
          description:
            "Company must have 3 years of operational track record",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-28T23:59:59Z",
          completedDate: "2026-02-10T10:00:00Z",
          assignedTo: "Akash Ambani",
          documents: ["doc_001", "doc_002"],
          notes:
            "Company incorporated in 2007, meets requirement",
        },
        {
          id: "sebi_004",
          title: "Net Tangible Assets Requirement",
          description: "Minimum ₹3 Crore net tangible assets",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-15T23:59:59Z",
          completedDate: "2026-03-10T15:30:00Z",
          assignedTo: "Akash Ambani",
          documents: ["doc_001"],
          notes: "Net tangible assets: ₹125 Crore",
        },
        {
          id: "sebi_005",
          title: "Profitability Requirement",
          description:
            "Net profit in 2 out of 3 preceding years",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-15T23:59:59Z",
          completedDate: "2026-03-10T15:45:00Z",
          assignedTo: "Akash Ambani",
          documents: ["doc_001", "doc_002"],
          notes:
            "Profitable in FY23, FY24, and FY25",
        },
        {
          id: "sebi_006",
          title: "Issue Size Limit",
          description:
            "Maximum issue size ₹25 Crore for SME",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-28T23:59:59Z",
          completedDate: "2026-02-05T12:00:00Z",
          assignedTo: "Isha Ambani",
          documents: [],
          notes: "Proposed issue size: ₹20 Crore",
        },
        {
          id: "sebi_007",
          title: "Merchant Banker Appointment",
          description:
            "Appoint SEBI registered merchant banker",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-15T23:59:59Z",
          completedDate: "2026-02-01T10:00:00Z",
          assignedTo: "Isha Ambani",
          documents: [],
          notes:
            "Appointed Kotak Investment Banking",
        },
        {
          id: "sebi_008",
          title: "Draft Offer Document Submission",
          description:
            "Submit draft offer document to stock exchange",
          status: "in_progress",
          priority: "high",
          dueDate: "2026-08-15T23:59:59Z",
          completedDate: null,
          assignedTo: "Isha Ambani",
          documents: [],
          notes:
            "Document preparation in progress - 75% complete",
        },
        {
          id: "sebi_009",
          title: "Minimum Subscription (90%)",
          description:
            "Ensure minimum 90% subscription in IPO",
          status: "not_started",
          priority: "medium",
          dueDate: "2026-12-12T23:59:59Z",
          completedDate: null,
          assignedTo: "Isha Ambani",
          documents: [],
          notes:
            "To be monitored during IPO period",
        },
        {
          id: "sebi_010",
          title: "Allotment Timeline Compliance",
          description:
            "Complete allotment within 6 days of issue closure",
          status: "not_started",
          priority: "medium",
          dueDate: "2026-12-18T23:59:59Z",
          completedDate: null,
          assignedTo: "Registrar",
          documents: [],
          notes: "Post-IPO compliance item",
        },
      ],
    },

    {
      id: "comp_exchange",
      name: "Stock Exchange Requirements",
      icon: "TrendingUp",
      color: "emerald",
      progress: 66,
      totalItems: 3,
      completedItems: 2,
      items: [
        {
          id: "bse_001",
          title: "BSE SME Platform Eligibility",
          description:
            "Meet all BSE SME listing criteria",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-20T10:00:00Z",
          assignedTo: "Isha Ambani",
          documents: [],
          notes:
            "All eligibility criteria met",
        },
        {
          id: "bse_002",
          title: "Listing Agreement Execution",
          description:
            "Execute listing agreement with BSE",
          status: "in_progress",
          priority: "high",
          dueDate: "2026-09-30T23:59:59Z",
          completedDate: null,
          assignedTo: "Isha Ambani",
          documents: [],
          notes:
            "Draft agreement under review",
        },
        {
          id: "bse_003",
          title: "Market Maker Appointment",
          description:
            "Appoint SEBI registered market maker",
          status: "completed",
          priority: "high",
          dueDate: "2026-10-31T23:59:59Z",
          completedDate: "2026-06-15T11:00:00Z",
          assignedTo: "Isha Ambani",
          documents: [],
          notes:
            "Appointed ICICI Securities",
        },
      ],
    },

    {
      id: "comp_legal",
      name: "Legal Compliance",
      icon: "Scale",
      color: "purple",
      progress: 60,
      totalItems: 5,
      completedItems: 3,
      items: [
        {
          id: "legal_001",
          title: "Companies Act, 2013 Compliance",
          description:
            "Ensure compliance with all applicable sections",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-25T14:00:00Z",
          assignedTo: "Anshuman Thakur",
          documents: [
            "doc_101",
            "doc_102",
            "doc_103",
          ],
          notes:
            "All statutory registers and filings up to date",
        },
        {
          id: "legal_002",
          title: "Board Resolution for IPO",
          description:
            "Obtain board approval for IPO",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-15T23:59:59Z",
          completedDate: "2026-02-10T16:00:00Z",
          assignedTo: "Anshuman Thakur",
          documents: ["doc_104"],
          notes:
            "Board resolution passed on 10-Feb-2026",
        },
        {
          id: "legal_003",
          title:
            "Shareholder Approval (Special Resolution)",
          description:
            "Obtain shareholder approval via special resolution",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-15T23:59:59Z",
          completedDate: "2026-03-05T18:00:00Z",
          assignedTo: "Anshuman Thakur",
          documents: [],
          notes:
            "EGM held on 05-Mar-2026, resolution passed with 99% votes",
        },
        {
          id: "legal_004",
          title: "Material Contracts Disclosure",
          description:
            "Disclose all material contracts in offer document",
          status: "in_progress",
          priority: "medium",
          dueDate: "2026-08-31T23:59:59Z",
          completedDate: null,
          assignedTo: "Anshuman Thakur",
          documents: [],
          notes:
            "Compiling list of material contracts",
        },
        {
          id: "legal_005",
          title: "Litigation Disclosure",
          description:
            "Disclose all pending litigations",
          status: "in_progress",
          priority: "medium",
          dueDate: "2026-08-31T23:59:59Z",
          completedDate: null,
          assignedTo: "Anshuman Thakur",
          documents: [],
          notes:
            "No major litigations pending",
        },
      ],
    },

    {
      id: "comp_tax",
      name: "Tax Compliance",
      icon: "DollarSign",
      color: "amber",
      progress: 66,
      totalItems: 3,
      completedItems: 2,
      items: [
        {
          id: "tax_001",
          title: "Income Tax Filings (Last 3 Years)",
          description:
            "Provide audited tax return filings and acknowledgements",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-12T10:00:00Z",
          assignedTo: "Akash Ambani",
          documents: [],
          notes:
            "ITR-6 filed for FY23, FY24, and FY25",
        },
        {
          id: "tax_002",
          title: "Transfer Pricing Reports",
          description:
            "Audited report for international and domestic transactions",
          status: "completed",
          priority: "medium",
          dueDate: "2026-04-30T23:59:59Z",
          completedDate: "2026-04-18T16:00:00Z",
          assignedTo: "Akash Ambani",
          documents: [],
          notes:
            "Clean report issued by Tax Auditor",
        },
        {
          id: "tax_003",
          title: "GST Reconciliation & Audits",
          description:
            "Annual GSTR-9 and GSTR-9C filings reconciliation",
          status: "in_progress",
          priority: "high",
          dueDate: "2026-07-25T23:59:59Z",
          completedDate: null,
          assignedTo: "Akash Ambani",
          documents: ["doc_004"],
          notes:
            "Reconciliation underway",
        },
      ],
    },
  ],
};

// ============= CURRENT USER / PERMISSION RESOLUTION =============
// Resolves the logged-in user's permissions from the existing team
// membership record (matched by userId), instead of hardcoding a
// name-based check anywhere in the UI layer.
export function getCurrentUserWithPermissions(): {
  profile: UserProfile;
  permissions: string[];
} {
  const teamRecord = mockIpoApplication.team.find(
    (member) => member.userId === mockUserProfile.id
  );

  return {
    profile: mockUserProfile,
    permissions: teamRecord?.permissions ?? [],
  };
}
