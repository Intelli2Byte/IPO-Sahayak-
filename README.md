# IPO Sahayak: AI-Powered SME IPO Document Automation Platform

**IPO Sahayak** is an AI-powered compliance and document generation platform that democratizes public capital market access for India’s 500,000+ IPO-eligible Small & Medium Enterprises (SMEs).

---

## 💡 The Problem & The Solution

Currently, preparing a Draft Red Herring Prospectus (DRHP) is a manual, expensive bottleneck:
* **Cost:** Preparing a DRHP costs **₹15–25 Lakhs** in advisory fees.
* **Timeline:** Takes **4–6 months** of continuous compliance auditing.
* **Volume:** Advisory barriers restrict listings to only **150–200 companies annually** across India.

**IPO Sahayak** solves this bottleneck through a guided, plain-language wizard interface that converts simple business profiles into SEBI-compliant legal text:
* **Auto-population:** Integrates directly with MCA21, GSTN, and Account Aggregator APIs to auto-fill **70%** of necessary company data.
* **Exhaustive Generation:** Instantly compiles 200+ page **Draft Red Herring Prospectus (DRHP)** documents alongside a 10-page **Abridged Prospectus**.
* **Impact:** Cuts document preparation costs by **60–70%** (down to ₹5–8 Lakhs) and slashes timelines by **70%** (down to 4–6 weeks).

---

## ⚙️ Process Flow Architecture

```
User Onboarding (React/PostgreSQL) 
  ➔ Enter CIN 
  ➔ Auto-Fetch MCA21 Data 
  ➔ Dynamic Form Generation (Promoter Details + PAN Verification via IT API) 
  ➔ Upload 3-Yr Financials 
  ➔ Background OCR & Cross-Validation 
  ➔ Input Plain Business Description 
  ➔ DeepSeek-V4-Pro Translation to Formal SEBI Disclosures 
  ➔ Define IPO Structure 
  ➔ System Calculates Capital/Dilution & Runs SEBI Limit Checks 
  ➔ Auto-Risk Detection (Leverage/Customer Concentration) 
  ➔ Upload Litigations & Compliance Docs (RoC/Tax/PF) 
  ➔ Invite Collaborators (CAs/Bankers) via WebSockets 
  ➔ Launch Background Puppeteer Job 
  ➔ Simultaneously Compile Dual Documents (Full DRHP + 10-Page Abridged Prospectus) 
  ➔ Merchant Banker Digital Review & Handoff
```

---

## 🚀 Core Features

1. **Intelligent 11-Step Questionnaire:** Features 250+ adaptive, conditionally-routed questions with real-time validation covering corporate identity, financials, and risk factors.
2. **AI Document Engine:** Uses NLP and a library of 50+ pre-approved legal clauses to convert plain-language text into formal SEBI disclosure formats (DRHPs and Abridged Prospectuses).
3. **Govt API Integrations:** Fetches live data via MCA21 (corporate/director profiles), GSTN (3-year revenue via GSTR-1/3B), Account Aggregators (banking verification), and Income Tax PAN verification.
4. **OCR Document Intelligence:** Automatically extracts Revenue, PAT, EBITDA, and Net Worth metrics from uploaded financial statements, cross-validating manual entries to flag discrepancies.
5. **Collaborative Secure Workspace:** Provides multi-user access (Promoters, Merchant Bankers, CAs, Lawyers) with threaded comments, digital signature workflows, and an ISO 27001-compliant document vault.
6. **Automated Compliance Engine:** Runs real-time validation checks against SEBI ICDR Regulations (2018) to calculate financial eligibility ratios and flag missing mandatory disclosures.
7. **API Fallback Mode:** Seamlessly reverts to manual upload with automated OCR data extraction (accepting CA-certified ITRs and audit reports) if government databases go offline.

---

## 🛠️ Technology Stack

| Component | Technologies & Frameworks |
| :--- | :--- |
| **Frontend** | Next.js, React 18, TypeScript, Tailwind CSS, Material-UI / Ant Design, React Hook Form + Yup, Zustand / Redux Toolkit |
| **Backend** | Node.js, Next.js API Routes, Express.js / NestJS, REST API + GraphQL, JWT + OAuth 2.0, RBAC, Redis |
| **Database & Storage** | PostgreSQL, MongoDB, Redis, AWS S3 / Google Cloud Storage (GCS) |
| **AI & ML Integration** | Fireworks AI (DeepSeek-V4-Pro, Kimi-K2.6, Qwen3.6-Plus), NLP (spaCy), OCR (Tesseract + Kimi-K2.6) |
| **Document Generation** | Puppeteer, PDFKit, Docxtemplater, Handlebars.js |
| **Cloud & DevOps** | AWS / GCP, Docker, Kubernetes, GitHub Actions, Sentry |
| **Other key Integrations** | Polygon Blockchain (audit trailing), MCA21 API, GSTN, Razorpay, SendGrid |

---

## 📂 Project Structure

```text
├── public/                 # Static assets (including PDF samples and official logos)
├── src/
│   ├── app/                # Next.js App Router (layout, globals, index page)
│   ├── components/         # Workspace dashboard components
│   │   ├── Dashboard/      # Overview screens, team controls, and analytics
│   │   ├── DocumentVault/  # PDF annotation vaults and split panel review tools
│   │   ├── Layout/         # Header bars and collapsible sidebars
│   │   └── Wizard/         # Multi-step questionnaire forms and funds allocation widgets
│   ├── data/               # App state mocks and client interfaces
│   └── styles/             # Modular tailwind templates
├── package.json            # Node.js dependencies configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🖥️ Getting Started

### Prerequisites
Make sure you have Node.js (version 18.x or above) installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Intelli2Byte/IPO-Sahayak-.git
   cd IPO-Sahayak-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Build the application for production:
   ```bash
   npm run build
   ```
