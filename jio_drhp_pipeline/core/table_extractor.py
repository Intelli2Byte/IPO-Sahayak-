from pathlib import Path
import config
from core.clients import llama_client
from core.retry import with_retry

@with_retry()
def extract_tables(filepath: Path) -> list[list[list[str]]]:
    """
    Dedicated table-mode extraction for financial/capital documents.
    Returns a list of tables, each table = list of rows, each row = list of cell strings.
    Uses agentic tier unconditionally — tables are the highest-risk content for accuracy.
    """
    upload_result = llama_client.files.create(file=filepath, purpose="parse")
    result = llama_client.parsing.parse(
        file_id=upload_result.id,
        tier="agentic",
        version="latest",
        expand=["markdown", "structuredData"] if hasattr(llama_client.parsing, "parse") else ["markdown"],
    )

    tables = []
    structured = getattr(result, "structured_data", None) or getattr(result, "structuredData", None)
    if structured:
        # Preferred path: native structured tables if tier/plan supports it
        tables = structured.get("tables", []) if isinstance(structured, dict) else []
    else:
        # Fallback: parse markdown pipe-tables manually
        markdown = ""
        if hasattr(result, "markdown") and result.markdown and getattr(result.markdown, "pages", None):
            markdown = "\n".join(p.markdown for p in result.markdown.pages if p.markdown)
        tables = _parse_markdown_tables(markdown)

    out_path = config.RAW_TABLES_DIR / f"{filepath.stem}_tables.json"
    import json
    out_path.write_text(json.dumps(tables, indent=2), encoding="utf-8")
    return tables

def _parse_markdown_tables(markdown: str) -> list[list[list[str]]]:
    tables, current = [], []
    for line in markdown.splitlines():
        stripped = line.strip()
        if stripped.startswith("|") and stripped.endswith("|"):
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            if set(stripped.replace("|", "").replace("-", "").replace(":", "").strip()) == set():
                continue  # separator row (---|---|---)
            current.append(cells)
        else:
            if current:
                tables.append(current)
                current = []
    if current:
        tables.append(current)
    return tables