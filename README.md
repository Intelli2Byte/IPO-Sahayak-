<div align="center">

  <img src="public/logos/IPO-sahayak_logo-new.png" alt="IPO Sahayak Logo" width="220" />

  # 🏛️ IPO Sahayak — SME IPO DRHP Generator

  <p align="center">
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/DeepSeek--V4-AI_Engine-412991?style=for-the-badge&logo=openai&logoColor=white" alt="DeepSeek V4" />
    <img src="https://img.shields.io/badge/Elasticsearch-Hybrid_Search-005571?style=for-the-badge&logo=elasticsearch&logoColor=white" alt="Elasticsearch" />
    <img src="https://img.shields.io/badge/FAISS-Vector_Store-FF6F61?style=for-the-badge&logo=meta&logoColor=white" alt="FAISS" />
    <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/PostgreSQL-ORM_DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Celery-Async_Queue-37B24D?style=for-the-badge&logo=celery&logoColor=white" alt="Celery" />
    <img src="https://img.shields.io/badge/Brevo-Email_API-00B2A9?style=for-the-badge&logo=sendinblue&logoColor=white" alt="Brevo" />
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License MIT" />
  </p>

  > **An agentic AI platform built for SEBI Compliance & SME IPO DRHP Generation — enabling SME promoters to generate a substantially complete, SEBI ICDR-compliant Draft Red Herring Prospectus (DRHP) — reducing preparation time from months to hours, with zero specialist legal knowledge required.**

</div>

---

## 📍 Table of Contents
- [💡 The Problem & The Solution](#-the-problem--the-solution)
- [✨ Core Features Breakdown](#-core-features-breakdown)
- [🖥️ Interactive Dashboard & User Experience Flow](#️-interactive-dashboard--user-experience-flow)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏗️ System Architecture & Visual Pipeline](#️-system-architecture--visual-pipeline)
  - [Step 1: Frontend User Journey & Wizard Onboarding](#step-1-frontend-user-journey--wizard-onboarding)
  - [Step 2: End-to-End System Architecture Overview](#step-2-end-to-end-system-architecture-overview)
  - [Step 3: Backend AI Document Processing & Retrieval Pipeline](#step-3-backend-ai-document-processing--retrieval-pipeline)
  - [Step 4: DRHP Synthesis, Section Compilation & Collaboration](#step-4-drhp-synthesis-section-compilation--collaboration)
  - [Step 5: Master Pipeline Overview](#step-5-master-pipeline-overview)
- [📂 Detailed Project Structure](#-detailed-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables Setup](#-environment-variables-setup)
  - [Installation & Local Setup](#-installation--quickstart)
- [🤝 Contributing to IPO Sahayak](#-contributing-to-ipo-sahayak)
- [📄 License & Attribution](#-license--attribution)

---

## 💡 The Problem & The Solution

Preparing a Draft Red Herring Prospectus (DRHP) under SEBI ICDR Regulations is a manual, expensive bottleneck for India's 500,000+ IPO-eligible Small & Medium Enterprises (SMEs):
* 💸 **Cost Barrier:** Preparing a DRHP costs **₹15–25 Lakhs** in advisory and legal fees.
* ⏳ **Time Bottleneck:** Takes **4–6 months** of continuous manual audit, drafting, and cross-verification.
* 📈 **Capacity Limit:** High fees and advisory complexity restrict listings to only **150–200 companies annually** across India.

**IPO Sahayak** solves this bottleneck through an automated, plain-language wizard and intelligent AI document engine:
* 🤖 **Auto-Population & Extraction:** Integrates directly with MCA21, GSTN, and Account Aggregator APIs while using **LlamaParse** & **PyMuPDF** to auto-fill **70%** of necessary company data.
* 📑 **Exhaustive Generation:** Instantly compiles 200+ page **Draft Red Herring Prospectus (DRHP)** documents alongside a 10-page **Abridged Prospectus** using DeepSeek-V4-Flash and DeepSeek-V4-Pro models.
* ⚡ **Drastic Impact:** Cuts document preparation costs by **60–70%** (down to ₹5–8 Lakhs) and slashes timelines by **70%** (down to 4–6 weeks).

---

## ✨ Core Features Breakdown

### 🤖 1. AI-Powered DRHP Content & Layout Engine (DeepSeek-V4)
* **DeepSeek-V4-Flash:** Rapidly translates raw business descriptions, promoter profiles, and financial notes into formal legal clauses aligned with SEBI ICDR Schedule VI guidelines.
* **DeepSeek-V4-Pro:** Dynamically designs visual PDF layouts, statutory header hierarchies, and complex tabular structures for financial statements.
* **5-Section AI Classifier:** Automatically tags and categorizes input disclosures into Corporate Identity, Business Overview, Financial Dossiers, Risk Factors, and Legal Litigations.

### 🔍 2. Hybrid RAG Retrieval Engine (BM25 + FAISS kNN + RRF)
* **BM25 Lexical Keyword Retrieval:** Matches exact statutory terms, act references, and regulatory sections from SEBI ICDR guidelines.
* **FAISS kNN Semantic Retrieval:** Uses `all-MiniLM-L6-v2` dense vector embeddings to perform semantic similarity searches over past DRHP disclosures.
* **Reciprocal Rank Fusion (RRF):** Fuses lexical and semantic search ranks to extract the top-k most relevant legal contexts into the AI prompt window.

### 📄 3. Document Intelligence & OCR Extraction (LlamaParse & PyMuPDF)
* **Multi-Format Ingestion:** Extracts text and structured tables from scanned PDFs, balance sheets, CA certificates, and Memorandums of Association (MoA).
* **Financial Table Parsing:** Extracts key financial metrics—including Revenue from Operations, EBITDA, Restated PAT, and Net Worth—and formats them into normalized JSON schemas.

### 📊 4. SEBI ICDR 2018 Automated Compliance Engine
* **Rule Check Automation:** Runs real-time validation checks against SEBI eligibility norms (e.g., minimum net worth, 3-year profitability criteria, promoter dilution limits).
* **Discrepancy Alerts:** Highlights missing statutory disclosures, unverified promoter PAN entries, or unhedged risk factors before document finalization.

### 🛡️ 5. ISO 27001 Document Vault & Interactive PDF Review
* **Dual-Panel Split Viewer:** Side-by-side view comparing source documents (scanned ITRs/audits) with generated DRHP pages.
* **In-Browser Annotation (`react-pdf` + `PDF.js`):** Allows Merchant Bankers, Chartered Accountants, and Legal Counsel to highlight text, leave threaded review comments, and affix digital signatures.

### ⚡ 6. Asynchronous Processing & Brevo Dispatch
* **Celery + Redis Queues:** Offloads PDF compilation, WeasyPrint/ReportLab layout rendering, and batch AI queries to background workers.
* **Brevo Email Service:** Triggers transactional emails, security verification codes, team invitation links, and review handoff notifications.

---

## 🖥️ Interactive Dashboard & User Experience Flow

Experience the intuitive, step-by-step SME promoter & Merchant Banker user flow of **IPO Sahayak**—from initial CIN onboarding registration to AI document auto-extraction, SEBI compliance validation, collaborative review with digital text highlighters, and Brevo email dispatch.

---

### Step 1: Onboarding Portal & Issuer Registration
The portal entry screen welcoming SME Issuers and Merchant Bankers. Promoters choose between registering a new SME Issuer account or logging in to an existing filing session.

<p align="center">
  <img src="public/images/dashboard/01_onboarding_portal_welcome.png" alt="Step 1: Onboarding Portal & Issuer Welcome Screen" width="95%" />
</p>

---

### Step 2: MCA21 CIN Lookup & Automated Corporate Profile Verification
Promoters enter their 21-character Corporate Identification Number (CIN). The platform queries MCA21 databases, instantly verifies company status (e.g. *Reliance Jio Infocomm Limited*), and auto-fills corporate information, primary email, and security verification credentials.

<p align="center">
  <img src="public/images/dashboard/02_mca21_cin_registration.png" alt="Step 2: MCA21 CIN Lookup & Verification" width="95%" />
</p>

---

### Step 3: Interactive Workspace Overview & Multilingual AI Engine
The main command dashboard displaying real-time application completion progress (67%), document upload counts (27/35 docs), SEBI compliance score (82%), and advisor review phase. Includes DeepSeek-V4 live multi-language translation (English ↔ Hindi).

<div align="center">

#### Workspace Overview Dashboard (English Mode)
<img src="public/images/dashboard/03_workspace_overview_english.png" alt="Step 3: Workspace Overview Dashboard - English" width="95%" />

<br/><br/>

#### DeepSeek-V4 AI Multi-Language Translation (Hindi Mode)
<img src="public/images/dashboard/04_multilanguage_translation_hindi.png" alt="Step 3: Multi-Language Translation - Hindi" width="95%" />

</div>

---

### Step 4: Guided 8-Panel DRHP Questionnaire Wizard
An adaptive, plain-language form wizard that collects statutory documents and auto-extracts business models, financial highlights, and risk factors using LlamaParse & PyMuPDF.

<details>
<summary><b>📸 Click to view 8-Panel DRHP Wizard Screenshots</b></summary>
<br/>

#### Panel 1: Corporate Identity & Certificate of Incorporation Upload
Upload Certificate of Incorporation (COI). The system automatically parses company name, CIN, incorporation date, and registered address.
<p align="center">
  <img src="public/images/dashboard/05_wizard_corporate_identity.png" alt="Wizard Panel 1: Corporate Identity" width="90%" />
</p>

#### Panel 3: Financial Dossier & Auto-Extracted Financial Highlights
Ingest 3-year restated financial statements and auditor reports. AI automatically extracts key financial KPIs including Revenue from Operations, PAT, EBITDA Margin, and Net Worth.
<p align="center">
  <img src="public/images/dashboard/06_wizard_financial_dossier.png" alt="Wizard Panel 3: Financial Dossier" width="90%" />
</p>

#### Panel 4: Monetization Channels & Market Positioning
AI pre-toggles active revenue channels (B2B/B2G direct sales, distributors, e-commerce storefronts) based on uploaded contracts and calculates client dependency metrics.
<p align="center">
  <img src="public/images/dashboard/07_wizard_market_channels.png" alt="Wizard Panel 4: Market Channels" width="90%" />
</p>

</details>

---

### Step 5: SEBI ICDR 2018 Automated Compliance Checklist
An automated regulatory compliance engine checking statutory requirements under SEBI ICDR Regulations (2018) Chapter XB. Displays live audit ratings (*Excellent Standing - 67 Score*), category progress, and priority alerts for promoter contribution rules.

<p align="center">
  <img src="public/images/dashboard/08_sebi_compliance_tracker.png" alt="Step 5: SEBI Compliance Checklist & Rules Engine" width="95%" />
</p>

---

### Step 6: ISO 27001 Document Vault & In-Browser Digital Highlighter
A secure document repository managing uploaded PDFs, SHA-256 digital signature validation, and audit history logs. Includes an in-browser digital text highlighter allowing legal reviewers to annotate source financial statements with yellow/red audit highlights.

<div align="center">

#### Document Vault File Manager & Approval Status
<img src="public/images/dashboard/09_document_vault_manager.png" alt="Document Vault Manager" width="95%" />

<br/><br/>

#### Document Viewer & SHA-256 Audit History Log
<img src="public/images/dashboard/10_document_audit_metadata.png" alt="Document Viewer & Audit Metadata" width="95%" />

<br/><br/>

#### In-Browser Digital Text Highlighter Active View
<img src="public/images/dashboard/11_inbrowser_digital_highlighter.png" alt="In-Browser Digital Highlighter Active View" width="95%" />

<br/><br/>

#### Saved Highlighted PDF Source Document Preview
<img src="public/images/dashboard/12_highlighted_pdf_preview.png" alt="Highlighted PDF Source Document Preview" width="95%" />

</div>

---

### Step 7: Team Access Collaboration & Brevo Transactional Email Handoff
Grant role-based filing access to Chartered Accountants, CFOs, and Legal Counsel. Dispatches shared DRHP documents directly to team members via Brevo's email notification service.

<div align="center">

#### Team Access Control & Document Handoff Manager
<img src="public/images/dashboard/13_team_access_collaboration.png" alt="Step 7: Team Access & Collaborator Manager" width="95%" />

<br/><br/>

#### Brevo Transactional Email Notification Delivered to Collaborator Inbox
<img src="public/images/dashboard/14_brevo_email_notification.png" alt="Brevo Transactional Email Notification" width="95%" />

</div>

---

### Step 8: Generated SEBI DRHP Document Output
Instant compilation of the official 200+ page Draft Red Herring Prospectus (DRHP) and 10-page Abridged Prospectus with Jio branding overlay, PDF preview controls, and one-click download options.

<p align="center">
  <img src="public/images/dashboard/15_generated_drhp_output.png" alt="Step 8: Generated Official SEBI DRHP Document Output" width="95%" />
</p>

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS, react-pdf, PDF.js, Zustand / Context API |
| **Backend API** | Python 3.10+, FastAPI, Pydantic, REST API, Uvicorn |
| **Database & Caching** | PostgreSQL (Relational Data), SQLite3 (Metadata), Redis (Cache & Celery Broker) |
| **Task Queue & Async** | Celery (Background Worker Queue) |
| **Search & Retrieval Engine**| Elasticsearch 8+, FAISS Vector Index (BM25 + kNN Hybrid Search, RRF Fusion) |
| **AI & Machine Learning** | DeepSeek-V4-Flash, DeepSeek-V4-Pro, LlamaParse, `all-MiniLM-L6-v2` Embeddings |
| **PDF Extraction & Parsing** | PyMuPDF (fitz), pdfplumber, LlamaParse |
| **PDF Compilation & Layout** | WeasyPrint, ReportLab, PyPDF2, pikepdf, LaTeX Compiler |
| **Communications & Dispatch**| Brevo API (Transactional Emails, Collaboration Invitations, Notifications) |
| **Government Integrations**| MCA21 API, GSTN API, Income Tax PAN Verification API |

---

## 🏗️ System Architecture & Visual Pipeline

### Step 1: Frontend User Journey & Wizard Onboarding
The entry flow for Merchant Bankers and SME Promoters. Users upload initial corporate documents (MoA, CA certificates, ITRs) into an 8-panel wizard form. The backend automatically parses inputs into structured JSON and populates AI suggested values.

<p align="center">
  <img src="public/images/architecture/01_frontend_user_journey.png" alt="Step 1: Frontend User Journey & Wizard Flow" width="100%" />
</p>

---

### Step 2: End-to-End System Architecture Overview
High-level system topology showing interaction between the Next.js Frontend, FastAPI Backend, LlamaParse parsing, Elasticsearch / FAISS hybrid search, DeepSeek-V4 AI models, Document Vault, and Brevo Email service.

<p align="center">
  <img src="public/images/architecture/02_system_architecture_overview.png" alt="Step 2: End-to-End System Architecture Overview" width="90%" />
</p>

---

### Step 3: Backend AI Document Processing & Retrieval Pipeline
Deep dive into document ingestion, semantic chunking, metadata extraction, dual storage (SQLite3 + FAISS), hybrid BM25 + kNN vector search, Reciprocal Rank Fusion (RRF), and DeepSeek-V4 section classification.

<p align="center">
  <img src="public/images/architecture/03_backend_ai_processing_pipeline.png" alt="Step 3: Backend AI Document Processing & Hybrid Retrieval Pipeline" width="100%" />
</p>

---

### Step 4: DRHP Synthesis, Section Compilation & Collaboration
The compilation lifecycle where classified section JSONs are validated, compiled by the Layout Engine, scored against SEBI compliance rules, rendered into final DRHP PDFs, and deployed to the ISO 27001 Document Vault for review and Brevo email sharing.

<p align="center">
  <img src="public/images/architecture/04_drhp_generation_collaboration.png" alt="Step 4: DRHP Generation & Collaboration Pipeline" width="90%" />
</p>

---

### Step 5: Master Pipeline Overview
Full end-to-end master workflow diagram visualizing the entire ecosystem from document upload to final legal review.

<details>
<summary><b>🔍 Click to view Master Pipeline Architecture Diagram</b></summary>
<br/>
<p align="center">
  <img src="public/images/architecture/05_master_pipeline_overview.png" alt="Step 5: Master Pipeline Overview" width="100%" />
</p>
</details>

---

## 📂 Detailed Project Structure

```text
IPO-Sahayak/
├── backend/                        # Python FastAPI backend & ML microservices
│   ├── api/                        # REST API endpoints & router setup
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application entry point & CORS configuration
│   │   └── routes.py               # API routes for document upload, parsing & status polling
│   ├── config/                     # Backend application configuration
│   │   ├── __init__.py
│   │   └── settings.py             # App settings, environment variables & CORS settings
│   ├── ml/                         # Machine Learning & NLP processing engines
│   │   ├── document_parser.py      # Core PDF text extraction & document layout parser
│   │   ├── document_section_detector.py # Heuristic & ML section boundary detector
│   │   ├── section_classifier.py   # NLP classifier mapping text to SEBI ICDR categories
│   │   ├── section_detector.py     # Section segmentation & layout analyzer
│   │   └── main.py                 # Standalone ML pipeline test & runner script
│   ├── models/                     # Data models & API request/response contracts
│   │   ├── __init__.py
│   │   └── schemas.py              # Pydantic schemas for DRHP disclosures & financial metrics
│   ├── services/                   # Business logic service layer
│   │   ├── __init__.py
│   │   ├── document_parser.py      # High-level document parsing service wrapper
│   │   ├── email_service.py        # Automated email notification & team invite dispatch
│   │   └── field_mapper.py         # SEBI DRHP field mapping & schema converter
│   ├── requirements.txt            # Python backend dependencies (FastAPI, PyPDF2, Pydantic, etc.)
│   └── .env                        # Backend environment variable configuration
│
├── jio_drhp_pipeline/              # Autonomous DRHP document synthesis & compilation pipeline
│   ├── main.py                     # Primary pipeline orchestration execution script
│   ├── config.py                   # AI LLM provider config (Fireworks AI, DeepSeek, OpenAI)
│   ├── check_setup.py              # Environment verification & API setup test script
│   ├── requirements.txt            # Python requirements for DRHP pipeline (requests, fitz, etc.)
│   ├── core/                       # Core pipeline modular processing engines
│   │   ├── __init__.py
│   │   ├── classifier.py           # Content categorization & prompt routing engine
│   │   ├── clients.py              # AI LLM HTTP client wrappers
│   │   ├── compiler.py             # LaTeX/PDF document compilation & rendering engine
│   │   ├── extractor.py            # Financial & legal text extractor
│   │   ├── layout_engine.py        # PDF visual layout & page composition manager
│   │   ├── retry.py                # Resiliency, retry strategy & exponential backoff
│   │   ├── table_extractor.py      # Structured table parser for balance sheets & P&L
│   │   ├── validator.py            # SEBI ICDR compliance checker & rule validator
│   │   ├── vector_engine.py        # RAG vector database & embedding manager
│   │   ├── versioning.py           # Document version control & revision history
│   │   └── watermark.py            # Draft watermarking & security overlay generator
│   └── sections_pipeline/          # SEBI Regulation specialized section generators
│       ├── 00_corporate_legal/     # Corporate Identity & Legal Disclosures Section
│       │   ├── prompts.py          # AI prompts for legal background & promoter disclosures
│       │   ├── runner.py           # Corporate legal section pipeline runner
│       │   └── schema.py           # Data schemas for legal disclosures
│       ├── 04_financials/          # Financial Disclosures & Restated Statements
│       │   ├── prompts.py          # AI prompts for financial restatement & ratios
│       │   ├── runner.py           # Financial section runner & compiler
│       │   └── schema.py           # Schemas for financial ratios & balance sheets
│       ├── 06_legal_regulatory/    # Litigation & Statutory Approvals
│       │   ├── prompts.py          # Prompts for tax litigation & government permissions
│       │   ├── runner.py           # Legal & regulatory pipeline runner
│       │   └── schema.py           # Schema for litigation data
│       └── 07_capital_structure/   # Shareholding Pattern & Capital Structure
│           ├── prompts.py          # AI prompts for pre/post-IPO capital structure
│           ├── runner.py           # Capital structure calculator & table builder
│           └── schema.py           # Schema for shareholding patterns & dilution
│
├── src/                            # Next.js 15 App Router Frontend Application
│   ├── app/                        # Next.js pages, layouts, and serverless API endpoints
│   │   ├── api/                    # Next.js API Routes
│   │   │   ├── auth/               # User authentication & session endpoints
│   │   │   ├── companies/          # Company profile & MCA21 data endpoints
│   │   │   ├── send-document/      # Email & PDF dispatch handler
│   │   │   ├── translate/          # DeepSeek AI multi-language translation endpoint
│   │   │   └── uploads/            # Document upload API handler
│   │   ├── globals.css             # Design tokens, custom glassmorphism & Tailwind styles
│   │   ├── layout.tsx              # Root app layout with multi-language & toast providers
│   │   ├── page.tsx                # Main Interactive Workspace Dashboard page
│   │   └── pdf-styles.css          # CSS styles for live PDF document preview rendering
│   ├── components/                 # Modular React UI Components
│   │   ├── Compliance/             # SEBI ICDR compliance tracker UI
│   │   │   └── ComplianceTracker.tsx # Interactive compliance checklist & rules engine
│   │   ├── Dashboard/              # Interactive analytics, team access & stats widgets
│   │   │   ├── CategoryChart.tsx   # Visual charts for compliance categories
│   │   │   ├── Overview.tsx        # Overview dashboard widget
│   │   │   ├── QuickStats.tsx      # Quick metrics & stats cards
│   │   │   └── TeamAccess.tsx     # RBAC team invitation & collaborator manager
│   │   ├── DocumentVault/          # Dual-panel PDF split viewer & document management
│   │   │   ├── CommentDrawer.tsx   # Threaded commentary & review notes drawer
│   │   │   ├── SplitDocumentViewer.tsx # Side-by-side PDF preview & source document viewer
│   │   │   └── VaultManager.tsx    # ISO 27001 document vault file manager
│   │   ├── GeneratedDocuments/     # Compiled DRHP document list & download manager
│   │   │   └── GeneratedDocuments.tsx # Generated PDF list, preview, & export actions
│   │   ├── Layout/                 # Navigation header & dynamic sidebar layout
│   │   │   ├── Header.tsx          # App header with language selector & profile controls
│   │   │   └── Sidebar.tsx         # Collapsible navigation sidebar
│   │   ├── Onboarding/             # MCA21 CIN lookup & initial company setup wizard
│   │   │   └── Onboarding.tsx      # Multi-step MCA21 CIN auto-fill onboarding flow
│   │   ├── UI/                     # Reusable micro-interactive UI components
│   │   │   ├── CursorTrail.tsx     # Custom cursor animation effect
│   │   │   ├── DocumentCard.tsx    # Document card container
│   │   │   ├── EvidenceUpload.tsx  # Document evidence upload dropzone
│   │   │   ├── FileUploadBox.tsx   # Dynamic drag-and-drop file uploader
│   │   │   ├── HighlighterField.tsx # Source PDF text highlighter
│   │   │   ├── InkCheckbox.tsx     # Styled custom checkbox component
│   │   │   ├── InkRadio.tsx        # Styled custom radio button component
│   │   │   ├── MagneticButton.tsx  # Interactive magnetic hover action button
│   │   │   ├── PaperStamp.tsx      # Digital SEBI approval stamp animation
│   │   │   ├── ProgressIndicator.tsx # Custom progress ring & bar
│   │   │   ├── SignatureUploadRow.tsx # CA & Promoter digital signature uploader
│   │   │   ├── Toast.tsx           # Custom notification toast alert
│   │   │   └── TypewriterText.tsx  # Dynamic typing animation component
│   │   └── Wizard/                 # 8-Panel DRHP step-by-step questionnaire system
│   │       ├── DocumentUploadZone.tsx # Financial & legal upload dropzone
│   │       ├── ExtractedDataPreview.tsx # OCR data extraction preview widget
│   │       ├── PanelOne_CorporateIdentity.tsx # Corporate details & promoter PAN info
│   │       ├── PanelTwo_BusinessOverview.tsx # Business model & Industry overview
│   │       ├── PanelThree_FinancialDossier.tsx # 3-Year financial metrics & restated financials
│   │       ├── PanelFour_MarketChannels.tsx # Market position, sales, & channels
│   │       ├── PanelFive_UseOfFundsLedger.tsx # Net IPO proceeds allocation & cap tables
│   │       ├── PanelSix_RiskAssessment.tsx # Internal & external risk factor builder
│   │       ├── PanelSeven_LegalDisclosures.tsx # Litigation, tax, & statutory permissions
│   │       ├── PanelEight_FinalReview.tsx # Final SEBI checklist & DRHP generation trigger
│   │       ├── StepFiveForm.tsx    # Dynamic sub-form step renderer
│   │       ├── StepWizard.tsx      # Wizard stepper layout manager & state wrapper
│   │       └── wizardTypes.ts      # TypeScript definitions for wizard state & forms
│   ├── context/                    # React Context State Providers
│   │   ├── GenerateDocumentsContext.tsx # Generation job status & progress state
│   │   ├── GeneratedDocumentsContext.tsx # Repository state for generated DRHP files
│   │   └── LanguageContext.tsx     # Multi-language translation & UI dictionary state
│   ├── data/                       # App state mocks & client interfaces
│   │   ├── generatedDocuments.ts   # Sample generated DRHP document data
│   │   └── mockData.ts             # Initial mock data for dashboard & compliance
│   ├── lib/                        # Shared client-side helper utilities
│   │   ├── document.ts             # Document processing helper functions
│   │   └── documents.ts            # Client document management utilities
│   └── types/                      # TypeScript type definitions
│       └── team-access.ts          # Access control & RBAC role type definitions
│
├── data/                           # Training data, parsed schemas, & document stores
│   ├── company1_prospectus_classified.json # SEBI classified DRHP sample dataset
│   ├── company1_prospectus_fixed_schema.json # Standardized JSON DRHP schema
│   ├── images/                     # Extracted document graphics & charts
│   ├── markdown/                   # Pre-parsed DRHP markdown documents
│   ├── pdfs/                       # Source financial statement PDFs
│   └── spreadsheets/               # Sample financial statement Excel models
│
├── docs/                           # Sample SME DRHPs & SEBI compliance reference documents
├── public/                         # Static web assets & official logos
├── .env.local                      # Frontend environment variable configuration
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js framework configuration
├── package.json                    # Node.js dependencies & script commands
├── postcss.config.mjs              # PostCSS configuration for Tailwind CSS
├── requirements.txt                # Root Python dependencies list
├── tsconfig.json                   # TypeScript compiler options
└── README.md                       # Comprehensive Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
Ensure your environment meets the following requirements:
* **Node.js**: v18.x or higher
* **Python**: 3.10 or higher
* **Redis**: v6.x or higher
* **PostgreSQL**: v14 or higher
* **Elasticsearch**: v8.x or higher

---

### 🔑 Environment Variables Setup

Configure the environment files for both backend and frontend applications.

#### 1. Backend Environment Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
# Database & Caching
DATABASE_URL=postgresql://user:password@localhost:5432/drhp_db
REDIS_URL=redis://localhost:6379/0

# Hybrid Vector Search (Elasticsearch)
ELASTICSEARCH_URL=http://localhost:9200

# AI & LLM Engine Keys
DEEPSEEK_API_KEY=your_deepseek_api_key
LLAMAPARSE_API_KEY=your_llamaparse_api_key

# Transactional Email & Notifications (Brevo API Integration)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=notifications@iposahayak.com
SENDER_NAME="IPO Sahayak Platform"
```

#### 2. Frontend Environment Configuration (`.env.local`)
Create a `.env.local` file in the project root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 💻 Installation & Quickstart

#### Step 1: Clone the Repository
```bash
git clone https://github.com/Intelli2Byte/IPO-Sahayak-.git
cd IPO-Sahayak-
```

#### Step 2: Set Up & Run Frontend (Next.js)
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```
The frontend application will be running at `http://localhost:3000`.

#### Step 3: Set Up & Run Backend (FastAPI Python Server)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Launch FastAPI application server
uvicorn api.main:app --reload --port 8000
```
The backend API documentation will be available at `http://localhost:8000/docs`.

#### Step 4: Start Celery Worker (Async Tasks & PDF Compilation)
```bash
cd backend
celery -A services.tasks worker --loglevel=info
```

#### Step 5: Build for Production
```bash
# Build frontend bundle
npm run build
```

---

## 🤝 Contributing to IPO Sahayak

We welcome contributions from developers, AI engineers, legal compliance experts, and open-source enthusiasts! Follow these simple step-by-step guidelines to get started:

### Step 1: Fork & Clone the Repository
Fork the repository on GitHub and clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/IPO-Sahayak-.git
cd IPO-Sahayak-
```

### Step 2: Create a Feature Branch
Create a descriptive branch for the feature or bugfix you are working on:
```bash
git checkout -b feature/amazing-new-feature
```

### Step 3: Set Up Local Development Environment
Install frontend dependencies and set up the Python backend virtual environment:
```bash
# Setup Frontend
npm install

# Setup Backend Virtual Environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 4: Commit Your Changes
Make sure your changes adhere to project code style standards:
```bash
git add .
git commit -m "feat(ai): integrate DeepSeek-V4 section validation rules"
```

### Step 5: Push to Your Fork & Open a Pull Request
Push your feature branch to your GitHub repository and submit a Pull Request:
```bash
git push origin feature/amazing-new-feature
```

### 📋 Code Review Guidelines:
* Ensure all TypeScript files pass linting (`npm run lint`).
* Ensure Python scripts conform to PEP8 standards.
* Include concise commit messages explaining the rationale behind your changes.
* Tag related issue numbers in your Pull Request description.

---

## 📄 License & Attribution
Distributed under the MIT License. See `LICENSE` for details. Built to democratize public capital market access for Indian SMEs.
