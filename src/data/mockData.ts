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

// ----------------- MOCK DATA CONSTANTS -----------------

export const mockUserProfile: UserProfile = {
  id: "usr_2024_001",
  firstName: "Rajesh",
  lastName: "Kumar",
  fullName: "Rajesh Kumar",
  email: "rajesh.kumar@nehafashion.com",
  phone: "+91 98765 43210",
  role: "promoter",
  designation: "Managing Director & CEO",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  companyId: "comp_neha_fashion_001",
  joinedDate: "2024-01-15T10:30:00Z",
  lastLogin: "2026-07-12T03:00:00Z",
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
      push: true
    },
    dashboardLayout: "default"
  }
};

export const mockCompanyDetails: CompanyDetails = {
  id: "comp_neha_fashion_001",
  legalName: "Neha Fashion Private Limited",
  brandName: "Neha Fashion",
  cin: "U18101MH2018PTC308344",
  pan: "AABCN1234F",
  gstin: "27AABCN1234F1Z5",
  incorporationDate: "2018-03-15",
  registeredAddress: {
    line1: "Plot No. 45, Sector 18",
    line2: "Vashi Industrial Estate",
    city: "Navi Mumbai",
    state: "Maharashtra",
    pincode: "400703",
    country: "India"
  },
  corporateAddress: {
    line1: "Tower A, 12th Floor",
    line2: "Mindspace Business Park, Malad West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400064",
    country: "India"
  },
  industry: "Textile & Apparel",
  sector: "Consumer Goods",
  subSector: "Fashion & Lifestyle",
  businessModel: "B2C E-commerce & Retail",
  companySize: "medium",
  employeeCount: 450,
  website: "https://www.nehafashion.com",
  logo: "/logos/neha-fashion-logo.png",
  foundedYear: 2018,
  description: "Leading fashion brand specializing in ethnic and fusion wear for women, with a strong online presence and 25+ retail stores across India.",
  socialMedia: {
    linkedin: "https://linkedin.com/company/neha-fashion",
    twitter: "https://twitter.com/nehafashion",
    instagram: "https://instagram.com/nehafashion",
    facebook: "https://facebook.com/nehafashion"
  },
  contactEmail: "info@nehafashion.com",
  contactPhone: "+91 22 4567 8900"
};

export const mockIpoApplication: IPOApplication = {
  id: "ipo_app_2024_nf_001",
  companyId: "comp_neha_fashion_001",
  applicationNumber: "IPO/2024/SME/001234",
  status: "in_progress",
  overallProgress: 67,
  currentStep: 5,
  totalSteps: 8,
  createdAt: "2024-02-01T09:00:00Z",
  lastUpdatedAt: "2026-07-11T16:45:00Z",
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
      cap: 95
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
        purpose: "Expansion of retail network",
        amount: 8000000,
        percentage: 40
      },
      {
        purpose: "Technology & E-commerce platform upgrade",
        amount: 5000000,
        percentage: 25
      },
      {
        purpose: "Working capital requirements",
        amount: 4000000,
        percentage: 20
      },
      {
        purpose: "General corporate purposes",
        amount: 3000000,
        percentage: 15
      }
    ]
  },
  stepProgress: [
    {
      stepNumber: 1,
      stepName: "Company Information",
      status: "completed",
      progress: 100,
      completedAt: "2024-02-05T14:30:00Z",
      fields: 25,
      completedFields: 25
    },
    {
      stepNumber: 2,
      stepName: "Promoter Details",
      status: "completed",
      progress: 100,
      completedAt: "2024-02-10T11:20:00Z",
      fields: 18,
      completedFields: 18
    },
    {
      stepNumber: 3,
      stepName: "Financial Information",
      status: "completed",
      progress: 100,
      completedAt: "2024-02-20T16:45:00Z",
      fields: 32,
      completedFields: 32
    },
    {
      stepNumber: 4,
      stepName: "Business Model & Operations",
      status: "completed",
      progress: 100,
      completedAt: "2024-03-01T10:15:00Z",
      fields: 22,
      completedFields: 22
    },
    {
      stepNumber: 5,
      stepName: "Use of Funds & Projections",
      status: "in_progress",
      progress: 75,
      completedAt: null,
      fields: 20,
      completedFields: 15
    },
    {
      stepNumber: 6,
      stepName: "Risk Factors & Disclosures",
      status: "not_started",
      progress: 0,
      completedAt: null,
      fields: 15,
      completedFields: 0
    },
    {
      stepNumber: 7,
      stepName: "Legal & Compliance",
      status: "not_started",
      progress: 0,
      completedAt: null,
      fields: 28,
      completedFields: 0
    },
    {
      stepNumber: 8,
      stepName: "Review & Submit",
      status: "locked",
      progress: 0,
      completedAt: null,
      fields: 1,
      completedFields: 0
    }
  ],
  team: [
    {
      userId: "usr_2024_001",
      name: "Rajesh Kumar",
      role: "Primary Promoter",
      permissions: ["view", "edit", "submit"]
    },
    {
      userId: "usr_2024_002",
      name: "Priya Sharma",
      role: "CFO",
      permissions: ["view", "edit"]
    },
    {
      userId: "usr_2024_003",
      name: "Amit Patel",
      role: "Company Secretary",
      permissions: ["view"]
    }
  ]
};

export const mockDashboardStats: DashboardStats = {
  overview: {
    applicationProgress: 67,
    documentsUploaded: 24,
    totalDocumentsRequired: 35,
    complianceScore: 82,
    pendingTasks: 8,
    completedTasks: 47,
    daysToDeadline: 45,
    lastActivity: "2026-07-11T16:45:00Z"
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
      description: "Overall completion status"
    },
    {
      id: "stat_2",
      label: "Documents Uploaded",
      value: 24,
      total: 35,
      unit: "docs",
      change: 3,
      changeType: "increase",
      icon: "FileText",
      color: "emerald",
      description: "Required documents submitted"
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
      description: "Regulatory compliance status"
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
      description: "Under MB & CA Audits"
    }
  ],
  recentActivity: [
    {
      id: "act_001",
      type: "document_upload",
      title: "Financial Statement Q4 FY24 uploaded",
      description: "Balance Sheet and P&L uploaded successfully",
      timestamp: "2026-07-11T16:45:00Z",
      user: "Priya Sharma",
      icon: "Upload",
      color: "emerald"
    },
    {
      id: "act_002",
      type: "form_update",
      title: "Use of Funds section updated",
      description: "Added detailed breakdown of capital expenditure",
      timestamp: "2026-07-11T14:20:00Z",
      user: "Rajesh Kumar",
      icon: "Edit",
      color: "blue"
    },
    {
      id: "act_003",
      type: "comment",
      title: "New comment from reviewer",
      description: "Clarification needed on revenue projections",
      timestamp: "2026-07-11T11:30:00Z",
      user: "SEBI Reviewer",
      icon: "MessageSquare",
      color: "amber"
    },
    {
      id: "act_004",
      type: "approval",
      title: "Promoter KYC approved",
      description: "All promoter documents verified successfully",
      timestamp: "2026-07-10T15:10:00Z",
      user: "System",
      icon: "CheckCircle",
      color: "emerald"
    },
    {
      id: "act_005",
      type: "task_complete",
      title: "Board resolution uploaded",
      description: "Resolution for IPO approval added to documents",
      timestamp: "2026-07-10T10:45:00Z",
      user: "Amit Patel",
      icon: "Check",
      color: "emerald"
    }
  ],
  upcomingDeadlines: [
    {
      id: "deadline_001",
      title: "Complete Risk Factors section",
      dueDate: "2026-07-15T23:59:59Z",
      priority: "high",
      status: "pending",
      assignedTo: "Rajesh Kumar",
      daysRemaining: 3
    },
    {
      id: "deadline_002",
      title: "Upload Auditor's Report FY24",
      dueDate: "2026-07-18T23:59:59Z",
      priority: "high",
      status: "pending",
      assignedTo: "Priya Sharma",
      daysRemaining: 6
    },
    {
      id: "deadline_003",
      title: "Submit Legal Opinion",
      dueDate: "2026-07-22T23:59:59Z",
      priority: "medium",
      status: "in_progress",
      assignedTo: "Amit Patel",
      daysRemaining: 10
    },
    {
      id: "deadline_004",
      title: "Complete Due Diligence Questionnaire",
      dueDate: "2026-07-25T23:59:59Z",
      priority: "medium",
      status: "not_started",
      assignedTo: "Rajesh Kumar",
      daysRemaining: 13
    }
  ],
  progressByCategory: [
    {
      category: "Company Information",
      progress: 100,
      status: "completed",
      color: "emerald"
    },
    {
      category: "Financial Data",
      progress: 85,
      status: "in_progress",
      color: "blue"
    },
    {
      category: "Legal Documents",
      progress: 60,
      status: "in_progress",
      color: "amber"
    },
    {
      category: "Compliance Documents",
      progress: 45,
      status: "in_progress",
      color: "amber"
    },
    {
      category: "Due Diligence Docs",
      progress: 30,
      status: "in_progress",
      color: "red"
    }
  ]
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
          name: "Audited Financial Statements FY 2023-24",
          fileName: "Financial_Statements_FY24.pdf",
          fileSize: 2458624,
          fileType: "application/pdf",
          uploadedAt: "2024-03-15T10:30:00Z",
          uploadedBy: "Priya Sharma",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2024-03-18T14:20:00Z",
          comments: [],
          url: "/documents/doc_001.pdf",
          thumbnail: "/thumbnails/doc_001.jpg"
        },
        {
          id: "doc_002",
          name: "Audited Financial Statements FY 2022-23",
          fileName: "Financial_Statements_FY23.pdf",
          fileSize: 2234567,
          fileType: "application/pdf",
          uploadedAt: "2024-03-15T10:35:00Z",
          uploadedBy: "Priya Sharma",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2024-03-18T14:25:00Z",
          comments: [],
          url: "/documents/doc_002.pdf",
          thumbnail: "/thumbnails/doc_002.jpg"
        },
        {
          id: "doc_003",
          name: "Tax Audit Report FY 2023-24",
          fileName: "Tax_Audit_Report_FY24.pdf",
          fileSize: 1567890,
          fileType: "application/pdf",
          uploadedAt: "2024-03-20T11:15:00Z",
          uploadedBy: "Priya Sharma",
          status: "under_review",
          version: 1,
          comments: [
            {
              id: "comment_001",
              author: "SEBI Reviewer",
              text: "Please provide clarification on deferred tax liability calculation",
              timestamp: "2024-03-22T09:30:00Z",
              type: "query"
            }
          ],
          url: "/documents/doc_003.pdf",
          thumbnail: "/thumbnails/doc_003.jpg"
        },
        {
          id: "doc_004",
          name: "GST Returns (Last 12 months)",
          fileName: "GST_Returns_12M.pdf",
          fileSize: 3456789,
          fileType: "application/pdf",
          uploadedAt: "2024-03-18T15:45:00Z",
          uploadedBy: "Priya Sharma",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2024-03-20T10:15:00Z",
          comments: [],
          url: "/documents/doc_004.pdf",
          thumbnail: "/thumbnails/doc_004.jpg"
        },
        {
          id: "doc_005",
          name: "Bank Statements (Last 6 months)",
          fileName: "Bank_Statements_6M.pdf",
          fileSize: 4567890,
          fileType: "application/pdf",
          uploadedAt: "2024-03-19T09:20:00Z",
          uploadedBy: "Priya Sharma",
          status: "approved",
          version: 1,
          approvedBy: "SEBI Reviewer",
          approvedAt: "2024-03-21T11:30:00Z",
          comments: [],
          url: "/documents/doc_005.pdf",
          thumbnail: "/thumbnails/doc_005.jpg"
        },
        {
          id: "doc_006",
          name: "Valuation Report",
          fileName: "Valuation_Report_2024.pdf",
          fileSize: 1890123,
          fileType: "application/pdf",
          uploadedAt: "2024-03-25T14:10:00Z",
          uploadedBy: "Rajesh Kumar",
          status: "pending",
          version: 1,
          comments: [],
          url: "/documents/doc_006.pdf",
          thumbnail: "/thumbnails/doc_006.jpg"
        }
      ]
    },
    {
      "id": "cat_legal",
      "name": "Legal Documents",
      "icon": "Scale",
      "color": "blue",
      "required": 12,
      "uploaded": 9,
      "approved": 7,
      "pending": 2,
      "rejected": 0,
      "documents": [
        {
          "id": "doc_101",
          "name": "Certificate of Incorporation",
          "fileName": "COI_Neha_Fashion.pdf",
          "fileSize": 567890,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-10T10:00:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-12T14:00:00Z",
          "comments": [],
          "url": "/documents/doc_101.pdf",
          "thumbnail": "/thumbnails/doc_101.jpg"
        },
        {
          "id": "doc_102",
          "name": "Memorandum of Association (MOA)",
          "fileName": "MOA_Neha_Fashion.pdf",
          "fileSize": 890123,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-10T10:15:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-12T14:15:00Z",
          "comments": [],
          "url": "/documents/doc_102.pdf",
          "thumbnail": "/thumbnails/doc_102.jpg"
        },
        {
          "id": "doc_103",
          "name": "Articles of Association (AOA)",
          "fileName": "AOA_Neha_Fashion.pdf",
          "fileSize": 1234567,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-10T10:30:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-12T14:30:00Z",
          "comments": [],
          "url": "/documents/doc_103.pdf",
          "thumbnail": "/thumbnails/doc_103.jpg"
        },
        {
          "id": "doc_104",
          "name": "Board Resolution for IPO",
          "fileName": "Board_Resolution_IPO.pdf",
          "fileSize": 456789,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-15T11:00:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-17T10:00:00Z",
          "comments": [],
          "url": "/documents/doc_104.pdf",
          "thumbnail": "/thumbnails/doc_104.jpg"
        },
        {
          "id": "doc_105",
          "name": "Shareholders Agreement",
          "fileName": "Shareholders_Agreement.pdf",
          "fileSize": 2345678,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-18T14:30:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-20T11:00:00Z",
          "comments": [],
          "url": "/documents/doc_105.pdf",
          "thumbnail": "/thumbnails/doc_105.jpg"
        },
        {
          "id": "doc_106",
          "name": "PAN Card (Company)",
          "fileName": "PAN_Neha_Fashion.pdf",
          "fileSize": 234567,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-10T09:45:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-12T13:45:00Z",
          "comments": [],
          "url": "/documents/doc_106.pdf",
          "thumbnail": "/thumbnails/doc_106.jpg"
        },
        {
          "id": "doc_107",
          "name": "GST Registration Certificate",
          "fileName": "GST_Certificate.pdf",
          "fileSize": 345678,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-10T09:50:00Z",
          "uploadedBy": "Amit Patel",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-12T13:50:00Z",
          "comments": [],
          "url": "/documents/doc_107.pdf",
          "thumbnail": "/thumbnails/doc_107.jpg"
        },
        {
          "id": "doc_108",
          "name": "Trademark Registration Certificates",
          "fileName": "Trademark_Certificates.pdf",
          "fileSize": 1567890,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-22T10:30:00Z",
          "uploadedBy": "Amit Patel",
          "status": "under_review",
          "version": 1,
          "comments": [],
          "url": "/documents/doc_108.pdf",
          "thumbnail": "/thumbnails/doc_108.jpg"
        },
        {
          "id": "doc_109",
          "name": "Property Documents (Registered Office)",
          "fileName": "Property_Docs_Registered_Office.pdf",
          "fileSize": 3456789,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-25T15:20:00Z",
          "uploadedBy": "Amit Patel",
          "status": "pending",
          "version": 1,
          "comments": [],
          "url": "/documents/doc_109.pdf",
          "thumbnail": "/thumbnails/doc_109.jpg"
        }
      ]
    },
    {
      "id": "cat_promoter",
      "name": "Promoter Documents",
      "icon": "Users",
      "color": "purple",
      "required": 10,
      "uploaded": 8,
      "approved": 8,
      "pending": 0,
      "rejected": 0,
      "documents": [
        {
          "id": "doc_201",
          "name": "Promoter KYC - Rajesh Kumar",
          "fileName": "KYC_Rajesh_Kumar.pdf",
          "fileSize": 1234567,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-08T10:00:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-10T14:00:00Z",
          "comments": [],
          "url": "/documents/doc_201.pdf",
          "thumbnail": "/thumbnails/doc_201.jpg"
        },
        {
          "id": "doc_202",
          "name": "PAN Card - Rajesh Kumar",
          "fileName": "PAN_Rajesh_Kumar.pdf",
          "fileSize": 234567,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-08T10:05:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-10T14:05:00Z",
          "comments": [],
          "url": "/documents/doc_202.pdf",
          "thumbnail": "/thumbnails/doc_202.jpg"
        },
        {
          "id": "doc_203",
          "name": "Aadhaar Card - Rajesh Kumar",
          "fileName": "Aadhaar_Rajesh_Kumar.pdf",
          "fileSize": 345678,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-08T10:10:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-10T14:10:00Z",
          "comments": [],
          "url": "/documents/doc_203.pdf",
          "thumbnail": "/thumbnails/doc_203.jpg"
        },
        {
          "id": "doc_204",
          "name": "Address Proof - Rajesh Kumar",
          "fileName": "Address_Proof_Rajesh_Kumar.pdf",
          "fileSize": 456789,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-08T10:15:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-10T14:15:00Z",
          "comments": [],
          "url": "/documents/doc_204.pdf",
          "thumbnail": "/thumbnails/doc_204.jpg"
        },
        {
          "id": "doc_205",
          "name": "Bank Account Statement - Rajesh Kumar",
          "fileName": "Bank_Statement_Rajesh_Kumar.pdf",
          "fileSize": 1567890,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-08T10:20:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-10T14:20:00Z",
          "comments": [],
          "url": "/documents/doc_205.pdf",
          "thumbnail": "/thumbnails/doc_205.jpg"
        },
        {
          "id": "doc_206",
          "name": "Photograph - Rajesh Kumar",
          "fileName": "Photo_Rajesh_Kumar.jpg",
          "fileSize": 123456,
          "fileType": "image/jpeg",
          "uploadedAt": "2024-02-08T10:25:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-10T14:25:00Z",
          "comments": [],
          "url": "/documents/doc_206.jpg",
          "thumbnail": "/thumbnails/doc_206.jpg"
        },
        {
          "id": "doc_207",
          "name": "Net Worth Certificate - Rajesh Kumar",
          "fileName": "Net_Worth_Rajesh_Kumar.pdf",
          "fileSize": 567890,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-12T11:00:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-14T10:00:00Z",
          "comments": [],
          "url": "/documents/doc_207.pdf",
          "thumbnail": "/thumbnails/doc_207.jpg"
        },
        {
          "id": "doc_208",
          "name": "Declaration of Non-Disqualification",
          "fileName": "Non_Disqualification_Declaration.pdf",
          "fileSize": 345678,
          "fileType": "application/pdf",
          "uploadedAt": "2024-02-12T11:30:00Z",
          "uploadedBy": "Rajesh Kumar",
          "status": "approved",
          "version": 1,
          "approvedBy": "SEBI Reviewer",
          "approvedAt": "2024-02-14T10:30:00Z",
          "comments": [],
          "url": "/documents/doc_208.pdf",
          "thumbnail": "/thumbnails/doc_208.jpg"
        }
      ]
    },
    {
      "id": "cat_compliance",
      "name": "Compliance Certificates",
      "icon": "Shield",
      "color": "amber",
      "required": 5,
      "uploaded": 1,
      "approved": 0,
      "pending": 1,
      "rejected": 0,
      "documents": [
        {
          "id": "doc_301",
          "name": "SEBI Compliance Certificate",
          "fileName": "SEBI_Compliance_Cert.pdf",
          "fileSize": 678901,
          "fileType": "application/pdf",
          "uploadedAt": "2024-03-10T14:00:00Z",
          "uploadedBy": "Amit Patel",
          "status": "pending",
          "version": 1,
          "comments": [],
          "url": "/documents/doc_301.pdf",
          "thumbnail": "/thumbnails/doc_301.jpg"
        }
      ]
    }
  ],
  summary: {
    totalRequired: 35,
    totalUploaded: 24,
    totalApproved: 20,
    totalPending: 3,
    totalUnderReview: 1,
    totalRejected: 0,
    completionPercentage: 68.57
  }
};

export const mockComplianceTracker: ComplianceTracker = {
  overallScore: 82,
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
          assignedTo: "Amit Patel",
          documents: ["doc_301"],
          notes: "All requirements met as per SEBI guidelines"
        },
        {
          id: "sebi_002",
          title: "Minimum Promoter Contribution (20%)",
          description: "Ensure promoters hold minimum 20% post-issue",
          status: "completed",
          priority: "high",
          dueDate: "2026-04-15T23:59:59Z",
          completedDate: "2026-03-20T11:00:00Z",
          assignedTo: "Rajesh Kumar",
          documents: [],
          notes: "Promoter holding: 65% pre-issue, 52% post-issue"
        },
        {
          id: "sebi_003",
          title: "Track Record Requirement (3 years)",
          description: "Company must have 3 years of operational track record",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-28T23:59:59Z",
          completedDate: "2026-02-10T10:00:00Z",
          assignedTo: "Priya Sharma",
          documents: ["doc_001", "doc_002"],
          notes: "Company incorporated in 2018, meets 3-year requirement"
        },
        {
          id: "sebi_004",
          title: "Net Tangible Assets Requirement",
          description: "Minimum ₹3 Crore net tangible assets",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-15T23:59:59Z",
          completedDate: "2026-03-10T15:30:00Z",
          assignedTo: "Priya Sharma",
          documents: ["doc_001"],
          notes: "Net tangible assets: ₹12.5 Crore"
        },
        {
          id: "sebi_005",
          title: "Profitability Requirement",
          description: "Net profit in 2 out of 3 preceding years",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-15T23:59:59Z",
          completedDate: "2026-03-10T15:45:00Z",
          assignedTo: "Priya Sharma",
          documents: ["doc_001", "doc_002"],
          notes: "Profitable in FY22, FY23, and FY24"
        },
        {
          id: "sebi_006",
          title: "Issue Size Limit",
          description: "Maximum issue size ₹25 Crore for SME",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-28T23:59:59Z",
          completedDate: "2026-02-05T12:00:00Z",
          assignedTo: "Rajesh Kumar",
          documents: [],
          notes: "Proposed issue size: ₹20 Crore"
        },
        {
          id: "sebi_007",
          title: "Merchant Banker Appointment",
          description: "Appoint SEBI registered merchant banker",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-15T23:59:59Z",
          completedDate: "2026-02-01T10:00:00Z",
          assignedTo: "Rajesh Kumar",
          documents: [],
          notes: "Appointed XYZ Capital Advisors"
        },
        {
          id: "sebi_008",
          title: "Draft Offer Document Submission",
          description: "Submit draft offer document to stock exchange",
          status: "in_progress",
          priority: "high",
          dueDate: "2026-08-15T23:59:59Z",
          completedDate: null,
          assignedTo: "Amit Patel",
          documents: [],
          notes: "Document preparation in progress - 75% complete"
        },
        {
          id: "sebi_009",
          title: "Minimum Subscription (90%)",
          description: "Ensure minimum 90% subscription in IPO",
          status: "not_started",
          priority: "medium",
          dueDate: "2026-12-12T23:59:59Z",
          completedDate: null,
          assignedTo: "Rajesh Kumar",
          documents: [],
          notes: "To be monitored during IPO period"
        },
        {
          id: "sebi_010",
          title: "Allotment Timeline Compliance",
          description: "Complete allotment within 6 days of issue closure",
          status: "not_started",
          priority: "medium",
          dueDate: "2026-12-18T23:59:59Z",
          completedDate: null,
          assignedTo: "Registrar",
          documents: [],
          notes: "Post-IPO compliance item"
        }
      ]
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
          description: "Meet all BSE SME listing criteria",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-20T10:00:00Z",
          assignedTo: "Amit Patel",
          documents: [],
          notes: "All eligibility criteria met"
        },
        {
          id: "bse_002",
          title: "Listing Agreement Execution",
          description: "Execute listing agreement with BSE",
          status: "in_progress",
          priority: "high",
          dueDate: "2026-09-30T23:59:59Z",
          completedDate: null,
          assignedTo: "Amit Patel",
          documents: [],
          notes: "Draft agreement under review"
        },
        {
          id: "bse_003",
          title: "Market Maker Appointment",
          description: "Appoint SEBI registered market maker",
          status: "completed",
          priority: "high",
          dueDate: "2026-10-31T23:59:59Z",
          completedDate: "2026-06-15T11:00:00Z",
          assignedTo: "Rajesh Kumar",
          documents: [],
          notes: "Appointed ABC Securities"
        }
      ]
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
          description: "Ensure compliance with all applicable sections",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-25T14:00:00Z",
          assignedTo: "Amit Patel",
          documents: ["doc_101", "doc_102", "doc_103"],
          notes: "All statutory registers and filings up to date"
        },
        {
          id: "legal_002",
          title: "Board Resolution for IPO",
          description: "Obtain board approval for IPO",
          status: "completed",
          priority: "high",
          dueDate: "2026-02-15T23:59:59Z",
          completedDate: "2026-02-10T16:00:00Z",
          assignedTo: "Amit Patel",
          documents: ["doc_104"],
          notes: "Board resolution passed on 10-Feb-2024"
        },
        {
          id: "legal_003",
          title: "Shareholder Approval (Special Resolution)",
          description: "Obtain shareholder approval via special resolution",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-15T23:59:59Z",
          completedDate: "2026-03-05T18:00:00Z",
          assignedTo: "Amit Patel",
          documents: [],
          notes: "EGM held on 05-Mar-2024, resolution passed with 98% votes"
        },
        {
          id: "legal_004",
          title: "Material Contracts Disclosure",
          description: "Disclose all material contracts in offer document",
          status: "in_progress",
          priority: "medium",
          dueDate: "2026-08-31T23:59:59Z",
          completedDate: null,
          assignedTo: "Amit Patel",
          documents: [],
          notes: "Compiling list of material contracts"
        },
        {
          id: "legal_005",
          title: "Litigation Disclosure",
          description: "Disclose all pending litigations",
          status: "in_progress",
          priority: "medium",
          dueDate: "2026-08-31T23:59:59Z",
          completedDate: null,
          assignedTo: "Amit Patel",
          documents: [],
          notes: "2 minor litigations pending, details being compiled"
        }
      ]
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
          description: "Provide audited tax return filings and acknowledgements",
          status: "completed",
          priority: "high",
          dueDate: "2026-03-31T23:59:59Z",
          completedDate: "2026-03-12T10:00:00Z",
          assignedTo: "Priya Sharma",
          documents: [],
          notes: "ITR-6 filed for FY22, FY23, and FY24"
        },
        {
          id: "tax_002",
          title: "Transfer Pricing Reports",
          description: "Audited report for international and domestic transactions",
          status: "completed",
          priority: "medium",
          dueDate: "2026-04-30T23:59:59Z",
          completedDate: "2026-04-18T16:00:00Z",
          assignedTo: "Priya Sharma",
          documents: [],
          notes: "Clean report issued by Tax Auditor"
        },
        {
          id: "tax_003",
          title: "GST Reconciliation & Audits",
          description: "Annual GSTR-9 and GSTR-9C filings reconciliation",
          status: "in_progress",
          priority: "high",
          dueDate: "2026-07-25T23:59:59Z",
          completedDate: null,
          assignedTo: "Priya Sharma",
          documents: ["doc_004"],
          notes: "Reconciliation underway for retail store sales"
        }
      ]
    }
  ]
};
