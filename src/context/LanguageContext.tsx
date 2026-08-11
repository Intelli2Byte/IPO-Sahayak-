'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;

  /**
   * English text -> Easy Hinglish in Devanagari
   *
   * Example:
   * t('Documents Upload') -> 'डॉक्यूमेंट्स अपलोड'
   */
  t: (englishText: string) => string;

  /**
   * Kept for compatibility with existing components.
   * There is NO API request now.
   */
  isTranslating: boolean;

  /**
   * Kept for compatibility with existing components.
   */
  preRegister: (texts: string[]) => void;

  showBanner: boolean;
  bannerMessage: string;
  dismissBanner: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/* =========================================================
   IMPORTANT TECHNICAL TERMS
   These should NEVER be translated.
========================================================= */

const PROTECTED_TERMS = [
  'IPO',
  'DRHP',
  'BSE',
  'NSE',
  'SME',
  'SEBI',
  'PDF',
  'JPG',
  'PNG',
  'FY25-26',
  'FY24-25',
  'FY23-24',
  'API',
  'AI',
  'AI/ML',
  'KPI',
  'GST',
  'PAN',
  'TAN',
  'CIN',
  'DIN',
  'ROC',
  'MCA',
  'RBI',
  'KYC',
  'FAQ',
  'URL',
  'CSV',
  'Excel',
  'ESOP',
  'DRHP',
  'SME IPO',
];

/* =========================================================
   EXACT PHRASE TRANSLATIONS
   These are checked FIRST.
========================================================= */

const PHRASE_TRANSLATIONS: Record<string, string> = {
  /* ---------------------------------------------------------
     NAVIGATION
  --------------------------------------------------------- */

  Overview: 'ओवरव्यू',

  'IPO Wizard': 'आईपीओ विज़ार्ड',

  'Document Vault': 'डॉक्यूमेंट वॉल्ट',

  'Compliance Tracker': 'कम्प्लायंस ट्रैकर',

  'Generated Documents': 'जनरेटेड डॉक्यूमेंट्स',

  'Team & Access': 'टीम और एक्सेस',

  'Team and Access': 'टीम और एक्सेस',

  Dashboard: 'डैशबोर्ड',

  Settings: 'सेटिंग्स',

  Notifications: 'नोटिफिकेशन्स',

  Profile: 'प्रोफाइल',

  Help: 'हेल्प',

  Support: 'सपोर्ट',

  Logout: 'लॉगआउट',

  Login: 'लॉगिन',

  /* ---------------------------------------------------------
     DOCUMENTS
  --------------------------------------------------------- */

  Documents: 'डॉक्यूमेंट्स',

  Document: 'डॉक्यूमेंट',

  'Upload Documents': 'डॉक्यूमेंट्स अपलोड करे',

  'Upload Document': 'डॉक्यूमेंट अपलोड करे',

  'Documents Upload': 'डॉक्यूमेंट्स अपलोड करे',

  'Documents Upload karein': 'डॉक्यूमेंट्स अपलोड करे',

  'Add Documents': 'डॉक्यूमेंट्स ऐड करे',

  'Add Document': 'डॉक्यूमेंट ऐड करे',

  'Document Details': 'डॉक्यूमेंट डिटेल्स',

  'Document Status': 'डॉक्यूमेंट स्टेटस',

  'Document Type': 'डॉक्यूमेंट टाइप',

  'Document Name': 'डॉक्यूमेंट नेम',

  'Uploaded By': 'अपलोडेड बाय',

  'Uploaded Date': 'अपलोडेड डेट',

  'Upload Date': 'अपलोड डेट',

  'File Specs': 'फाइल स्पेक्स',

  'File Details': 'फाइल डिटेल्स',

  'File Name': 'फाइल नेम',

  'File Size': 'फाइल साइज',

  'File Type': 'फाइल टाइप',

  'Browse Files': 'फाइल्स ब्राउज़ करे',

  'Browse File': 'फाइल ब्राउज़ करे',

  'Drag and drop files here': 'फाइल्स यहां ड्रैग और ड्रॉप करे',

  'Drag files here, or browse files':
    'फाइल्स यहां ड्रैग करे, या ब्राउज़ करे',

  'Download Document': 'डॉक्यूमेंट डाउनलोड करे',

  'Download File': 'फाइल डाउनलोड करे',

  'Preview Document': 'डॉक्यूमेंट प्रीव्यू',

  'View Document': 'डॉक्यूमेंट व्यू करे',

  'Delete Document': 'डॉक्यूमेंट डिलीट करे',

  'Edit Document': 'डॉक्यूमेंट एडिट करे',

  /* ---------------------------------------------------------
     BUTTONS / ACTIONS
  --------------------------------------------------------- */

  Continue: 'कंटिन्यू करे',

  'Continue IPO Form': 'IPO फॉर्म कंटिन्यू करे',

  'Continue Form': 'फॉर्म कंटिन्यू करे',

  Submit: 'सबमिट करे',

  'Submit Application': 'एप्लिकेशन सबमिट करे',

  Save: 'सेव करे',

  'Save Changes': 'चेंजेस सेव करे',

  Cancel: 'कैंसल करे',

  Close: 'क्लोज़ करे',

  Edit: 'एडिट करे',

  Delete: 'डिलीट करे',

  View: 'व्यू करे',

  Search: 'सर्च',

  Filter: 'फिल्टर',

  Apply: 'अप्लाई करे',

  Reset: 'रीसेट करे',

  Refresh: 'रिफ्रेश करे',

  Retry: 'रिट्राय करे',

  Next: 'नेक्स्ट',

  Previous: 'पिछला',

  Back: 'बैक',

  'Go Back': 'बैक जाएं',

  'Learn More': 'और जानें',

  'View Details': 'डिटेल्स देखें',

  'See Details': 'डिटेल्स देखें',

  'View All': 'सभी देखें',

  'Show More': 'और देखें',

  'Show Less': 'कम देखें',

  /* ---------------------------------------------------------
     DASHBOARD
  --------------------------------------------------------- */

  'Welcome Back': 'वेलकम बैक',

  'Welcome Back,': 'वेलकम बैक,',

  'IPO Dashboard': 'IPO डैशबोर्ड',

  'Application Progress': 'एप्लिकेशन प्रोग्रेस',

  'Documents Uploaded': 'डॉक्यूमेंट्स अपलोडेड',

  'Compliance Score': 'कम्प्लायंस स्कोर',

  'Advisor Review Phase': 'एडवाइज़र रिव्यू फेज़',

  'Listing Milestones': 'लिस्टिंग माइलस्टोन्स',

  'Steps Done': 'स्टेप्स कम्प्लीट',

  'Steps Completed': 'स्टेप्स कम्प्लीट',

  'Actions Required': 'एक्शन्स रिक्वायर्ड',

  'Action Required': 'एक्शन रिक्वायर्ड',

  'Next Up': 'नेक्स्ट अप',

  'Application Complete': 'एप्लिकेशन कम्प्लीट',

  /* ---------------------------------------------------------
     IPO
  --------------------------------------------------------- */

  'IPO Application': 'IPO एप्लिकेशन',

  'IPO application': 'IPO एप्लिकेशन',

  'IPO Form': 'IPO फॉर्म',

  'IPO Listing Campaign': 'IPO लिस्टिंग कैम्पेन',

  'IPO Listing': 'IPO लिस्टिंग',

  'Listing Campaign': 'लिस्टिंग कैम्पेन',

  'Listing Milestone': 'लिस्टिंग माइलस्टोन',

  'Use of Funds': 'यूज़ ऑफ फंड्स',

  'Use of Funds & Projections': 'यूज़ ऑफ फंड्स और प्रोजेक्शन्स',

  'Use of Funds and Projections':
    'यूज़ ऑफ फंड्स और प्रोजेक्शन्स',

  Projections: 'प्रोजेक्शन्स',

  'Risk Factors': 'रिस्क फैक्टर्स',

  'Capital History': 'कैपिटल हिस्ट्री',

  'Share Capital': 'शेयर कैपिटल',

  'Shareholders': 'शेयरहोल्डर्स',

  'Promoters': 'प्रमोटर्स',

  'Promoter Group': 'प्रमोटर ग्रुप',

  'Offer Details': 'ऑफर डिटेल्स',

  'Issue Details': 'इश्यू डिटेल्स',

  'Financial Information': 'फाइनेंशियल इन्फॉर्मेशन',

  'Financial Statements': 'फाइनेंशियल स्टेटमेंट्स',

  'Financial Documents': 'फाइनेंशियल डॉक्यूमेंट्स',

  'Business Overview': 'बिज़नेस ओवरव्यू',

  'Business Details': 'बिज़नेस डिटेल्स',

  'Company Information': 'कम्पनी इन्फॉर्मेशन',

  'Company Details': 'कम्पनी डिटेल्स',

  /* ---------------------------------------------------------
     STATUS
  --------------------------------------------------------- */

  Approved: 'अप्रूव्ड',

  Pending: 'पेंडिंग',

  Required: 'रिक्वायर्ड',

  Uploaded: 'अपलोडेड',

  Rejected: 'रिजेक्टेड',

  Completed: 'कम्प्लीटेड',

  Incomplete: 'इनकम्प्लीट',

  Draft: 'ड्राफ्ट',

  Active: 'एक्टिव',

  Inactive: 'इनएक्टिव',

  Verified: 'वेरिफाइड',

  Unverified: 'अनवेरिफाइड',

  Processing: 'प्रोसेसिंग',

  /* ---------------------------------------------------------
     TEAM
  --------------------------------------------------------- */

  Team: 'टीम',

  Access: 'एक्सेस',

  Permissions: 'परमिशन्स',

  Members: 'मेंबर्स',

  'Team Members': 'टीम मेंबर्स',

  Role: 'रोल',

  Roles: 'रोल्स',

  Owner: 'ओनर',

  Admin: 'एडमिन',

  Member: 'मेंबर',

  Advisor: 'एडवाइज़र',

  Reviewer: 'रिव्यूअर',

  'Board of Director': 'बोर्ड ऑफ डायरेक्टर',

  'Board of Directors': 'बोर्ड ऑफ डायरेक्टर्स',

  /* ---------------------------------------------------------
     COMPLIANCE
  --------------------------------------------------------- */

  Compliance: 'कम्प्लायंस',

  'Compliance Score': 'कम्प्लायंस स्कोर',

  'Compliance Check': 'कम्प्लायंस चेक',

  'Compliance Status': 'कम्प्लायंस स्टेटस',

  Alerts: 'अलर्ट्स',

  Alert: 'अलर्ट',

  Warning: 'वार्निंग',

  Warnings: 'वार्निंग्स',

  'Risk Factors': 'रिस्क फैक्टर्स',

  /* ---------------------------------------------------------
     DRHP
  --------------------------------------------------------- */

  'DRHP Vault': 'DRHP वॉल्ट',

  'DRHP Vault Summary': 'DRHP वॉल्ट समरी',

  'DRHP Documents': 'DRHP डॉक्यूमेंट्स',

  'DRHP Section': 'DRHP सेक्शन',

  'DRHP Form': 'DRHP फॉर्म',

  'Generate DRHP': 'DRHP जनरेट करे',

  'Generate Document': 'डॉक्यूमेंट जनरेट करे',

  'Generated Document': 'जनरेटेड डॉक्यूमेंट',

  /* ---------------------------------------------------------
     COMMON UI
  --------------------------------------------------------- */

  Name: 'नेम',

  Email: 'ईमेल',

  Phone: 'फोन',

  Mobile: 'मोबाइल',

  Address: 'एड्रेस',

  City: 'सिटी',

  State: 'स्टेट',

  Country: 'कंट्री',

  Date: 'डेट',

  Time: 'टाइम',

  Status: 'स्टेटस',

  Type: 'टाइप',

  Category: 'कैटेगरी',

  Description: 'डिस्क्रिप्शन',

  Details: 'डिटेल्स',

  Amount: 'अमाउंट',

  Value: 'वैल्यू',

  Total: 'टोटल',

  Count: 'काउंट',

  Percentage: 'परसेंटेज',

  Progress: 'प्रोग्रेस',

  Phase: 'फेज़',

  Step: 'स्टेप',

  Steps: 'स्टेप्स',

  Review: 'रिव्यू',

  Reviewed: 'रिव्यूड',

  Approval: 'अप्रूवल',

  Query: 'क्वेरी',

  Queries: 'क्वेरीज',

  Comments: 'कमेंट्स',

  Notes: 'नोट्स',

  Information: 'इन्फॉर्मेशन',

  Details: 'डिटेल्स',

  /* ---------------------------------------------------------
     UPLOAD AREA
  --------------------------------------------------------- */

  'Add files': 'फाइल्स ऐड करे',

  'Add files here': 'फाइल्स यहां ऐड करे',

  'Upload a file': 'फाइल अपलोड करे',

  'Upload a document': 'डॉक्यूमेंट अपलोड करे',

  'Choose file': 'फाइल चुनें',

  'Choose files': 'फाइल्स चुनें',

  'Select file': 'फाइल सेलेक्ट करे',

  'Select files': 'फाइल्स सेलेक्ट करे',

  'No file selected': 'कोई फाइल सेलेक्ट नहीं है',

  'Upload successful': 'अपलोड सक्सेसफुल',

  'Upload failed': 'अपलोड फेल हुआ',

  /* ---------------------------------------------------------
     AUTH
  --------------------------------------------------------- */

  Username: 'यूज़रनेम',

  Password: 'पासवर्ड',

  'Forgot Password': 'पासवर्ड भूल गए?',

  'Sign In': 'साइन इन करे',

  'Sign Up': 'साइन अप करे',

  'Log In': 'लॉग इन करे',

  'Log Out': 'लॉग आउट करे',

  'Create Account': 'अकाउंट क्रिएट करे',

  /* ---------------------------------------------------------
     BANNER
  --------------------------------------------------------- */

  'Page translated to Hindi':
    'पेज को आसान Hinglish में ट्रांसलेट किया गया है। Common IPO, finance और technical terms English में रखे गए हैं ताकि उन्हें समझना आसान रहे।',
};

/* =========================================================
   WORD LEVEL TRANSLATIONS
   Used when an exact phrase isn't available.
========================================================= */

const WORD_TRANSLATIONS: Record<string, string> = {
  welcome: 'वेलकम',
  back: 'बैक',

  overview: 'ओवरव्यू',
  dashboard: 'डैशबोर्ड',

  ipo: 'IPO',
  wizard: 'विज़ार्ड',

  document: 'डॉक्यूमेंट',
  documents: 'डॉक्यूमेंट्स',

  vault: 'वॉल्ट',

  compliance: 'कम्प्लायंस',
  tracker: 'ट्रैकर',

  generated: 'जनरेटेड',

  team: 'टीम',
  access: 'एक्सेस',
  members: 'मेंबर्स',
  member: 'मेंबर',

  upload: 'अपलोड',
  uploaded: 'अपलोडेड',
  uploading: 'अपलोडिंग',

  add: 'ऐड',
  added: 'ऐडेड',

  browse: 'ब्राउज़',
  files: 'फाइल्स',
  file: 'फाइल',

  download: 'डाउनलोड',
  preview: 'प्रीव्यू',

  continue: 'कंटिन्यू',
  submit: 'सबमिट',
  save: 'सेव',
  cancel: 'कैंसल',
  close: 'क्लोज़',

  edit: 'एडिट',
  delete: 'डिलीट',
  view: 'व्यू',

  search: 'सर्च',
  filter: 'फिल्टर',
  reset: 'रीसेट',
  refresh: 'रिफ्रेश',

  application: 'एप्लिकेशन',
  form: 'फॉर्म',

  progress: 'प्रोग्रेस',
  complete: 'कम्प्लीट',
  completed: 'कम्प्लीटेड',
  incomplete: 'इनकम्प्लीट',

  status: 'स्टेटस',
  type: 'टाइप',
  category: 'कैटेगरी',

  details: 'डिटेल्स',
  detail: 'डिटेल',

  information: 'इन्फॉर्मेशन',
  description: 'डिस्क्रिप्शन',

  financial: 'फाइनेंशियल',
  finance: 'फाइनेंस',

  business: 'बिज़नेस',
  company: 'कम्पनी',

  shareholder: 'शेयरहोल्डर',
  shareholders: 'शेयरहोल्डर्स',

  promoter: 'प्रमोटर',
  promoters: 'प्रमोटर्स',

  capital: 'कैपिटल',
  share: 'शेयर',
  shares: 'शेयर्स',

  offer: 'ऑफर',
  issue: 'इश्यू',

  funds: 'फंड्स',
  projections: 'प्रोजेक्शन्स',
  projection: 'प्रोजेक्शन',

  risk: 'रिस्क',
  factors: 'फैक्टर्स',
  factor: 'फैक्टर',

  advisor: 'एडवाइज़र',
  reviewer: 'रिव्यूअर',
  review: 'रिव्यू',
  reviewed: 'रिव्यूड',

  phase: 'फेज़',
  milestone: 'माइलस्टोन',
  milestones: 'माइलस्टोन्स',

  step: 'स्टेप',
  steps: 'स्टेप्स',

  action: 'एक्शन',
  actions: 'एक्शन्स',
  required: 'रिक्वायर्ड',

  approved: 'अप्रूव्ड',
  approve: 'अप्रूव',
  approval: 'अप्रूवल',

  pending: 'पेंडिंग',
  rejected: 'रिजेक्टेड',
  verified: 'वेरिफाइड',
  unverified: 'अनवेरिफाइड',

  processing: 'प्रोसेसिंग',

  alert: 'अलर्ट',
  alerts: 'अलर्ट्स',
  warning: 'वार्निंग',
  warnings: 'वार्निंग्स',

  role: 'रोल',
  roles: 'रोल्स',
  permissions: 'परमिशन्स',

  name: 'नेम',
  email: 'ईमेल',
  phone: 'फोन',
  mobile: 'मोबाइल',

  address: 'एड्रेस',
  city: 'सिटी',
  state: 'स्टेट',
  country: 'कंट्री',

  date: 'डेट',
  time: 'टाइम',

  amount: 'अमाउंट',
  value: 'वैल्यू',
  total: 'टोटल',
  count: 'काउंट',
  percentage: 'परसेंटेज',

  comments: 'कमेंट्स',
  comment: 'कमेंट',
  notes: 'नोट्स',
  note: 'नोट',

  settings: 'सेटिंग्स',
  notification: 'नोटिफिकेशन',
  notifications: 'नोटिफिकेशन्स',

  help: 'हेल्प',
  support: 'सपोर्ट',

  login: 'लॉगिन',
  logout: 'लॉगआउट',
  username: 'यूज़रनेम',
  password: 'पासवर्ड',

  next: 'नेक्स्ट',
  previous: 'पिछला',
  back: 'बैक',

  apply: 'अप्लाई',
  retry: 'रिट्राय',

  successful: 'सक्सेसफुल',
  failed: 'फेल',

  addendum: 'ऐडेंडम',

  listing: 'लिस्टिंग',
  campaign: 'कैम्पेन',

  audit: 'ऑडिट',
  verification: 'वेरिफिकेशन',
  verified: 'वेरिफाइड',

  query: 'क्वेरी',
  queries: 'क्वेरीज',

  specs: 'स्पेक्स',
  specification: 'स्पेसिफिकेशन',
  specifications: 'स्पेसिफिकेशन्स',

  board: 'बोर्ड',
  director: 'डायरेक्टर',
  directors: 'डायरेक्टर्स',

  FY25: 'FY25',
  FY26: 'FY26',

  english: 'English',
  hindi: 'Hindi',
};

/* =========================================================
   PHRASE NORMALIZATION
========================================================= */

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

/* =========================================================
   PROTECT TECHNICAL TERMS
========================================================= */

function protectTechnicalTerms(text: string) {
  const protectedValues: string[] = [];

  let result = text;

  PROTECTED_TERMS.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

    result = result.replace(regex, (match) => {
      const index = protectedValues.length;

      protectedValues.push(match);

      return `__PROTECTED_${index}__`;
    });
  });

  return {
    text: result,
    protectedValues,
  };
}

/* =========================================================
   RESTORE TECHNICAL TERMS
========================================================= */

function restoreTechnicalTerms(
  text: string,
  protectedValues: string[]
): string {
  let result = text;

  protectedValues.forEach((value, index) => {
    result = result.replace(
      new RegExp(`__PROTECTED_${index}__`, 'g'),
      value
    );
  });

  return result;
}

/* =========================================================
   WORD TRANSLATION
========================================================= */

function translateWords(text: string): string {
  return text.replace(
    /\b[A-Za-z][A-Za-z'-]*\b/g,
    (word: string) => {
      const lower = word.toLowerCase();

      if (WORD_TRANSLATIONS[lower]) {
        return WORD_TRANSLATIONS[lower];
      }

      return word;
    }
  );
}

/* =========================================================
   EASY HINGLISH TRANSLATOR
========================================================= */

function translateToEasyHinglish(input: string): string {
  if (!input) {
    return input;
  }

  const original = input;

  const normalized = normalizeText(input);

  if (!normalized) {
    return original;
  }

  /* -------------------------------------------------------
     1. EXACT PHRASE MATCH
  ------------------------------------------------------- */

  if (PHRASE_TRANSLATIONS[normalized]) {
    return PHRASE_TRANSLATIONS[normalized];
  }

  /* -------------------------------------------------------
     2. PROTECT TECHNICAL TERMS
  ------------------------------------------------------- */

  const protectedResult = protectTechnicalTerms(normalized);

  /* -------------------------------------------------------
     3. PHRASES THAT CONTAIN VARIABLES / NUMBERS
  ------------------------------------------------------- */

  let result = protectedResult.text;

  /*
   * Example:
   * "Your IPO application is 67% complete."
   *
   * ->
   * "आपका IPO एप्लिकेशन 67% कम्प्लीट है।"
   */

  result = result.replace(
    /^Your (.+?) application is (.+?) complete\.?$/i,
    'आपका $1 एप्लिकेशन $2 कम्प्लीट है'
  );

  result = result.replace(
    /^Your (.+?) is (.+?) complete\.?$/i,
    'आपका $1 $2 कम्प्लीट है'
  );

  result = result.replace(
    /^Welcome Back,?\s*(.*)$/i,
    (_, name: string) => {
      if (name?.trim()) {
        return `वेलकम बैक, ${name.trim()}`;
      }

      return 'वेलकम बैक';
    }
  );

  /*
   * "4 of 8 milestones completed"
   */
  result = result.replace(
    /^(\d+)\s+of\s+(\d+)\s+milestones?\s+completed$/i,
    '$1 of $2 माइलस्टोन्स कम्प्लीट'
  );

  /*
   * "4 of 8 Steps Done"
   */
  result = result.replace(
    /^(\d+)\s+of\s+(\d+)\s+Steps?\s+Done$/i,
    '$1 of $2 स्टेप्स कम्प्लीट'
  );

  /*
   * "2 Actions Required"
   */
  result = result.replace(
    /^(\d+)\s+Actions?\s+Required$/i,
    '$1 एक्शन्स रिक्वायर्ड'
  );

  /*
   * "27 / 35 docs"
   */
  result = result.replace(
    /^(\d+)\s*\/\s*(\d+)\s+docs?$/i,
    '$1 / $2 डॉक्यूमेंट्स'
  );

  /*
   * "6 Uploaded • 5 Approved • 8 Required"
   */
  result = result.replace(
    /\buploaded\b/gi,
    'अपलोडेड'
  );

  result = result.replace(
    /\bapproved\b/gi,
    'अप्रूव्ड'
  );

  result = result.replace(
    /\brequired\b/gi,
    'रिक्वायर्ड'
  );

  /* -------------------------------------------------------
     4. COMMON ENGLISH CONNECTORS
  ------------------------------------------------------- */

  result = result.replace(/\band\b/gi, 'और');

  result = result.replace(/\bof\b/gi, 'ऑफ');

  result = result.replace(/\bfor\b/gi, 'के लिए');

  result = result.replace(/\bwith\b/gi, 'के साथ');

  result = result.replace(/\bvia\b/gi, 'के जरिए');

  result = result.replace(/\bhere\b/gi, 'यहां');

  result = result.replace(/\bor\b/gi, 'या');

  /* -------------------------------------------------------
     5. WORD LEVEL TRANSLATION
  ------------------------------------------------------- */

  result = translateWords(result);

  /* -------------------------------------------------------
     6. RESTORE TECHNICAL TERMS
  ------------------------------------------------------- */

  result = restoreTechnicalTerms(
    result,
    protectedResult.protectedValues
  );

  /* -------------------------------------------------------
     7. CLEANUP
  ------------------------------------------------------- */

  result = result
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?%:;])/g, '$1')
    .trim();

  /*
   * IMPORTANT:
   *
   * If Argos/Google/any other translator accidentally generated
   * nonsense such as:
   *
   * A-A-A-A-A-A
   *
   * we NEVER return that.
   *
   * We simply return the original English text.
   */

  const lettersOnly = result
    .replace(/[^A-Za-z-]/g, '')
    .replace(/-/g, '');

  if (
    lettersOnly.length > 20 &&
    /^A+$/i.test(lettersOnly)
  ) {
    return original;
  }

  return result;
}

/* =========================================================
   LANGUAGE PROVIDER
========================================================= */

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>('en');

  const [showBanner, setShowBanner] = useState(false);

  const [bannerMessage, setBannerMessage] = useState('');

  /*
   * IMPORTANT:
   *
   * There is NO translation API.
   *
   * Therefore this is ALWAYS false.
   */

  const isTranslating = false;

  /* =======================================================
     TRANSLATE FUNCTION
  ======================================================= */

  const t = useCallback(
    (englishText: string): string => {
      if (!englishText) {
        return englishText;
      }

      /*
       * ENGLISH MODE
       *
       * Absolutely no translation.
       */
      if (language === 'en') {
        return englishText;
      }

      /*
       * HINDI MODE
       *
       * Local Easy Hinglish translation.
       *
       * NO API CALL.
       */
      return translateToEasyHinglish(englishText);
    },
    [language]
  );

  /* =======================================================
     PRE REGISTER
  ======================================================= */

  const preRegister = useCallback((_texts: string[]) => {
    /*
     * Kept intentionally empty.
     *
     * Older components may call:
     *
     * preRegister([...])
     *
     * but because translation is local, there is nothing
     * that needs to be registered or fetched.
     */
  }, []);

  /* =======================================================
     TOGGLE LANGUAGE
  ======================================================= */

  const toggleLanguage = useCallback(() => {
    setLanguage((currentLanguage) => {
      if (currentLanguage === 'en') {
        setBannerMessage(
          'पेज को आसान Hinglish में ट्रांसलेट किया गया है। Common IPO, finance और technical terms English में रखे गए हैं ताकि उन्हें समझना आसान रहे।'
        );

        setShowBanner(true);

        return 'hi';
      }

      /*
       * HI -> EN
       *
       * No API call.
       */
      setBannerMessage('Switched back to English.');

      setShowBanner(true);

      return 'en';
    });
  }, []);

  /* =======================================================
     DISMISS BANNER
  ======================================================= */

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  /* =======================================================
     PROVIDER VALUE
  ======================================================= */

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      toggleLanguage,
      t,
      isTranslating,
      preRegister,
      showBanner,
      bannerMessage,
      dismissBanner,
    }),
    [
      language,
      toggleLanguage,
      t,
      isTranslating,
      preRegister,
      showBanner,
      bannerMessage,
      dismissBanner,
    ]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider'
    );
  }

  return context;
}