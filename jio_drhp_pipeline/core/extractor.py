from pathlib import Path
import json
import config
from core.clients import llama_client
from core.retry import with_retry

@with_retry()
def _upload_and_parse(filepath: Path, tier: str) -> str:
    upload_result = llama_client.files.create(file=filepath, purpose="parse")
    result = llama_client.parsing.parse(
        file_id=upload_result.id,
        tier=tier,
        version="latest",
        expand=["markdown"],
    )
    if hasattr(result, "markdown") and result.markdown and getattr(result.markdown, "pages", None):
        return "\n".join(p.markdown for p in result.markdown.pages if p.markdown)
    if isinstance(result, dict) and "markdown" in result:
        return result["markdown"]
    return ""

def extract_folder(source_folder: str) -> list[dict]:
    """Parse every PDF in a 01_raw_inputs/<source_folder> using the tier mapped in config.TIER_MAP."""
    folder_path = config.RAW_INPUTS_DIR / source_folder
    tier = config.TIER_MAP.get(source_folder, "balanced")
    results = []

    if not folder_path.exists():
        print(f"⚠️  Folder not found: {folder_path}")
        return results

    pdfs = sorted(folder_path.glob("*.pdf"))
    print(f"🚀 Extracting {len(pdfs)} files from '{source_folder}' using tier='{tier}'")

    for pdf in pdfs:
        print(f"  🔄 {pdf.name}")
        markdown = _upload_and_parse(pdf, tier)

        md_out = config.RAW_MARKDOWN_DIR / f"{pdf.stem}.md"
        md_out.write_text(markdown, encoding="utf-8")

        results.append({
            "filename": pdf.name,
            "source_folder": source_folder,
            "tier_used": tier,
            "markdown_path": str(md_out),
            "markdown": markdown,
        })
        print(f"  ✅ Saved: {md_out.name}")

    return results

def extract_all() -> dict:
    """Extract every configured source folder. Returns {source_folder: [doc records]}."""
    all_results = {}
    seen_folders = {v["source_folder"] for v in config.SECTION_REGISTRY.values() if v["source_folder"]}
    for folder in seen_folders:
        all_results[folder] = extract_folder(folder)
    return all_results
