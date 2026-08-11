# 📄 IPO Sahayak: AI-Powered DRHP Generation & Compliance Analysis Platform

**IPO Sahayak** is an enterprise-grade AI compliance and document automation platform that democratizes public capital market access for India’s 500,000+ IPO-eligible Small & Medium Enterprises (SMEs). 

It combines a modern Next.js 15 frontend, a high-performance Python FastAPI backend, DeepSeek-V4 AI models, Celery async task processing, Brevo notifications, and Elasticsearch hybrid retrieval (BM25 + kNN vector search) to intelligently parse, generate, compile, and review SEBI-compliant Draft Red Herring Prospectus (DRHP) documents.

---

## 💡 The Problem & The Solution

Preparing a Draft Red Herring Prospectus (DRHP) under SEBI ICDR Regulations is a manual, expensive bottleneck for SMEs:
* **Cost:** Preparing a DRHP costs **₹15–25 Lakhs** in advisory fees.
* **Timeline:** Takes **4–6 months** of continuous compliance auditing.
* **Volume:** Advisory barriers restrict listings to only **150–200 companies annually** across India.

**IPO Sahayak** solves this bottleneck through an automated, plain-language wizard and AI document engine:
* **Auto-Population & Extraction:** Integrates directly with MCA21, GSTN, and Account Aggregator APIs while using LlamaParse & PyMuPDF to auto-fill **70%** of company and financial data.
* **Exhaustive Generation:** Instantly compiles 200+ page **Draft Red Herring Prospectus (DRHP)** documents alongside a 10-page **Abridged Prospectus** using DeepSeek-V4-Flash and DeepSeek-V4-Pro models.
* **Impact:** Cuts document preparation costs by **60–70%** (down to ₹5–8 Lakhs) and slashes timelines by **70%** (down to 4–6 weeks).

---

## ✨ Key Features

* **Intelligent Document Generation:** Leverages **DeepSeek-V4-Flash** and **DeepSeek-V4-Pro** to convert plain-language disclosures into SEBI-compliant legal text and dynamic DRHP section layouts.
* **Advanced Document Parsing & OCR:** Uses **LlamaParse**, **PyMuPDF**, and **pdfplumber** to extract text, tables, and financial metrics (Revenue, PAT, EBITDA, Net Worth) from uploaded financial dossiers.
* **Hybrid Search Retrieval:** Combines BM25 lexical search and kNN vector search (via `all-MiniLM-L6-v2`) with Reciprocal Rank Fusion (RRF) and metadata filtering in **Elasticsearch** for RAG-based clause lookup.
* **Interactive PDF Review & Annotation:** In-browser PDF rendering with interactive highlighting, split-panel source viewer, and annotation layers using **react-pdf** and **PDF.js**.
* **Asynchronous Processing:** Offloads heavy PDF compilation (WeasyPrint, ReportLab, LaTeX engine) and batch AI generation tasks to **Celery** workers backed by **Redis**.
* **Automated Notifications & Handoff:** Transactional emails, CA/Banker invitation workflows, and digital signature review alerts powered by **Brevo**.
* **Automated Compliance Engine:** Performs real-time validation checks against SEBI ICDR Regulations (2018) to verify financial eligibility ratios and flag missing statutory disclosures.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS, react-pdf, PDF.js, Zustand / Context API |
| **Backend API** | Python 3.10+, FastAPI, Pydantic, REST API, Uvicorn |
| **Database & Caching** | PostgreSQL (Relational Data), Redis (Cache & Celery Broker) |
| **Task Queue & Async** | Celery (Background Worker Queue) |
| **Search & Retrieval Engine**| Elasticsearch 8+ (Hybrid BM25 + kNN Search, RRF Fusion, Chunk Storage) |
| **AI & Machine Learning** | DeepSeek-V4-Flash, DeepSeek-V4-Pro, LlamaParse, `all-MiniLM-L6-v2` Embeddings |
| **PDF Extraction & Parsing** | PyMuPDF (fitz), pdfplumber, LlamaParse |
| **PDF Compilation & Layout** | WeasyPrint, ReportLab, PyPDF2, pikepdf, LaTeX Compiler |
| **Communications & Dispatch**| Brevo API (Transactional Emails, Collaboration Invitations, Notifications) |
| **Government Integrations**| MCA21 API, GSTN API, Income Tax PAN Verification API |

---

## 🏗️ System Architecture & Workflow

```text
[User Onboarding / Form Wizard] 
       │
       ├──► MCA21 / GSTN Auto-Fetch API ──► Auto-fills 70% Company Profile
       ├──► Document Ingestion ──────────► LlamaParse & PyMuPDF (Text & Table Extraction)
       │                                     │
       │                                     ▼
       │                               Embedding Engine (`all-MiniLM-L6-v2`)
       │                                     │
       │                                     ▼
       │                               Elasticsearch Index (BM25 + kNN Hybrid Search)
       │
       ├──► Plain Disclosures Input ────► DeepSeek-V4-Pro AI Generation Engine
       │                                     │
       │                                     ▼
       │                               Celery Task Queue (Redis Broker)
       │                                     │
       │                                     ▼
       │                               PDF Layout & LaTeX/WeasyPrint Compilation
       │                                     │
       │                                     ▼
       ├──► Brevo Notification Service ──► Email Merchant Bankers, CAs & Promoters
       │
       └──► Interactive PDF Review Vault ► Split Viewer (react-pdf + PDF.js Highlighting)
```

### Detailed Pipeline Workflow:
1. **Ingestion & Parsing:** Documents uploaded via the 8-Panel Wizard are parsed using LlamaParse and PyMuPDF. Text and tables are chunked, embedded using `all-MiniLM-L6-v2`, and indexed into Elasticsearch.
2. **Hybrid Retrieval (RAG):** Compliance queries and clause generation trigger a hybrid search in Elasticsearch, fusing lexical (BM25) and semantic (kNN) results using Reciprocal Rank Fusion (RRF).
3. **AI Generation:** FastAPI sends the context-rich prompt and metadata to DeepSeek-V4 models to format formal SEBI disclosures.
4. **Async Compilation:** Heavy PDF layout rendering (WeasyPrint, ReportLab, PyPDF2) runs asynchronously via Celery workers backed by Redis.
5. **Review & Handoff:** The Next.js frontend renders live PDF previews using `react-pdf` and `PDF.js` with inline text highlighting. Brevo triggers automated transactional email alerts for team collaborators.

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

## 📄 License & Attribution
Distributed under the MIT License. See `LICENSE` for details. Built to democratize public capital market access for Indian SMEs.
