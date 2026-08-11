import os
from pathlib import Path
from dotenv import load_dotenv


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")


# ============================================================
# API KEYS
# ============================================================

LLAMA_CLOUD_API_KEY = os.getenv("LLAMA_CLOUD_API_KEY")
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")

if not LLAMA_CLOUD_API_KEY or not FIREWORKS_API_KEY:
    raise EnvironmentError(
        "Missing API keys — check .env at project root."
    )


# ============================================================
# PATHS
# ============================================================

WORKSPACE_DIR = BASE_DIR / "workspace"

# Raw input documents
RAW_INPUTS_DIR = WORKSPACE_DIR / "01_raw_inputs"

# Extracted text
EXTRACTED_TEXT_DIR = WORKSPACE_DIR / "02_extracted_text"
RAW_MARKDOWN_DIR = EXTRACTED_TEXT_DIR / "raw_markdown"
RAW_TABLES_DIR = EXTRACTED_TEXT_DIR / "raw_tables"
MANIFEST_PATH = EXTRACTED_TEXT_DIR / "manifest.json"

# Vector database
VECTOR_DB_DIR = WORKSPACE_DIR / "03_vector_db"
FAISS_INDEX_PATH = VECTOR_DB_DIR / "index.faiss"
FAISS_PKL_PATH = VECTOR_DB_DIR / "index.pkl"
METADATA_DB_PATH = VECTOR_DB_DIR / "metadata_store.sqlite"

# Output reports
OUTPUT_REPORTS_DIR = WORKSPACE_DIR / "04_output_reports"
ASSETS_DIR = OUTPUT_REPORTS_DIR / "assets"
SEBI_LOGO_PATH = ASSETS_DIR / "sebi_logo.png"

SECTIONS_OUT_DIR = OUTPUT_REPORTS_DIR / "sections"
VALIDATION_DIR = OUTPUT_REPORTS_DIR / "validation_reports"
VERSIONS_DIR = OUTPUT_REPORTS_DIR / "versions"

# Logs
LOGS_DIR = WORKSPACE_DIR / "05_logs"


# ============================================================
# AUTO-CREATE RUNTIME DIRECTORIES
# ============================================================

for d in [
    RAW_MARKDOWN_DIR,
    RAW_TABLES_DIR,
    VECTOR_DB_DIR,
    ASSETS_DIR,
    SECTIONS_OUT_DIR,
    VALIDATION_DIR,
    VERSIONS_DIR,
    LOGS_DIR,
]:
    d.mkdir(parents=True, exist_ok=True)


# ============================================================
# LLAMAPARSE TIER ROUTING
# ============================================================

TIER_MAP = {
    "financial_statements": "agentic",
    "financial_notes": "agentic",
    "capital_shareholding": "agentic",
    "governance_audit": "balanced",
    "corporate_legal": "cost_effective",
}


# ============================================================
# FIREWORKS MODELS
# ============================================================

FIREWORKS_LAYOUT_MODEL = (
    "accounts/fireworks/models/deepseek-v4-pro"
)

FIREWORKS_CONTENT_MODEL = (
    "accounts/fireworks/models/deepseek-v4-flash"
)

FIREWORKS_CLASSIFIER_MODEL = (
    "accounts/fireworks/models/deepseek-v4-flash"
)

LOCAL_EMBEDDING_MODEL = "all-MiniLM-L6-v2"


# ============================================================
# QUALITY GATE
# ============================================================

ACCURACY_THRESHOLD = float(
    os.getenv("ACCURACY_THRESHOLD", 0.86)
)


# ============================================================
# CHUNKING
# ============================================================

CHUNK_SIZE = 700
CHUNK_OVERLAP = 150


# ============================================================
# WATERMARK
# ============================================================

WATERMARK_DEFAULTS = {
    "opacity": 0.08,
    "rotation_deg": 45,
    "scale_pct": 0.6,
    "position": "center",
}


# ============================================================
# SECTION REGISTRY
#
# FIRST TEST:
# Only 00_corporate_legal is enabled.
#
# 04_financials,
# 06_legal_regulatory,
# 07_capital_structure
# are temporarily disabled using pending_input.
# ============================================================

SECTION_REGISTRY = {

    # --------------------------------------------------------
    # SECTION 00 — CORPORATE & LEGAL
    # --------------------------------------------------------

    "00_corporate_legal": {
        "source_folder": "corporate_legal",
        "status": "ready",
        "display_name": "Corporate & Legal Baseline",
    },


    # --------------------------------------------------------
    # SECTION 01 — RISK FACTORS
    # --------------------------------------------------------

    "01_risk_factors": {
        "source_folder": None,
        "status": "pending_input",
        "display_name": "Risk Factors",
    },


    # --------------------------------------------------------
    # SECTION 02 — OBJECTS OF THE ISSUE
    # --------------------------------------------------------

    "02_objects_issue": {
        "source_folder": None,
        "status": "pending_input",
        "display_name": "Objects of the Issue",
    },


    # --------------------------------------------------------
    # SECTION 03 — BUSINESS & INDUSTRY
    # --------------------------------------------------------

    "03_business_industry": {
        "source_folder": None,
        "status": "pending_input",
        "display_name": "Business & Industry Overview",
    },


    # --------------------------------------------------------
    # SECTION 04 — FINANCIALS
    #
    # DISABLED FOR FIRST TEST
    # --------------------------------------------------------

    "04_financials": {
        "source_folder": "financial_statements",
        "status": "pending_input",
        "display_name": "Financial Information",
    },


    # --------------------------------------------------------
    # SECTION 05 — PROMOTERS & MANAGEMENT
    # --------------------------------------------------------

    "05_promoters_management": {
        "source_folder": None,
        "status": "pending_input",
        "display_name": "Promoters & Management",
    },


    # --------------------------------------------------------
    # SECTION 06 — LEGAL & REGULATORY
    #
    # DISABLED FOR FIRST TEST
    # --------------------------------------------------------

    "06_legal_regulatory": {
        "source_folder": "governance_audit",
        "status": "pending_input",
        "display_name": "Legal & Regulatory Matters",
    },


    # --------------------------------------------------------
    # SECTION 07 — CAPITAL STRUCTURE
    #
    # DISABLED FOR FIRST TEST
    # --------------------------------------------------------

    "07_capital_structure": {
        "source_folder": "capital_shareholding",
        "status": "pending_input",
        "display_name": "Capital & Issue Structure",
    },
}