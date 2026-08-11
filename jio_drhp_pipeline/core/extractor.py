from pathlib import Path
import config
from core.clients import llama_client
from core.retry import with_retry


@with_retry()
def _upload_and_parse(filepath: Path, tier: str) -> str:
    upload_result = llama_client.files.create(
        file=filepath,
        purpose="parse",
    )

    result = llama_client.parsing.parse(
        file_id=upload_result.id,
        tier=tier,
        version="latest",
        expand=["markdown"],
    )

    if (
        hasattr(result, "markdown")
        and result.markdown
        and getattr(result.markdown, "pages", None)
    ):
        return "\n".join(
            p.markdown
            for p in result.markdown.pages
            if p.markdown
        )

    if isinstance(result, dict) and "markdown" in result:
        return result["markdown"]

    return ""


def extract_folder(source_folder: str, force: bool = False) -> list[dict]:
    """
    Parse every PDF in a 01_raw_inputs/<source_folder> using the tier
    mapped in config.TIER_MAP.

    Skips files that already have a non-empty cached .md output unless
    force=True. A cached file that is empty/whitespace-only is treated
    as a failed prior extraction and is reprocessed automatically.
    """
    folder_path = config.RAW_INPUTS_DIR / source_folder
    tier = config.TIER_MAP.get(source_folder, "cost_effective")
    results = []

    if not folder_path.exists():
        print(f"⚠️  Folder not found: {folder_path}")
        return results

    pdfs = sorted(folder_path.glob("*.pdf"))
    print(
        f"🚀 Extracting {len(pdfs)} files from "
        f"'{source_folder}' using tier='{tier}'"
    )

    skipped, reprocessed, failed_empty = 0, 0, 0

    for pdf in pdfs:
        md_out = config.RAW_MARKDOWN_DIR / f"{pdf.stem}.md"

        cached_text = None
        if md_out.exists() and not force:
            existing = md_out.read_text(encoding="utf-8")
            if existing.strip():
                cached_text = existing
            else:
                print(f"  ⚠️  Cached file is empty, reprocessing: {pdf.name}")

        if cached_text is not None:
            print(f"  ⏭️  Skipping (already extracted): {pdf.name}")
            skipped += 1
            results.append({
                "filename": pdf.name,
                "source_folder": source_folder,
                "tier_used": tier,
                "markdown_path": str(md_out),
                "markdown": cached_text,
            })
            continue

        print(f"  🔄 {pdf.name}")
        markdown = _upload_and_parse(pdf, tier)
        md_out.write_text(markdown, encoding="utf-8")

        if not markdown.strip():
            failed_empty += 1
            print(f"  ⚠️  Extracted markdown is empty for: {pdf.name}")
        else:
            reprocessed += 1
            print(f"  ✅ Saved: {md_out.name}")

        results.append({
            "filename": pdf.name,
            "source_folder": source_folder,
            "tier_used": tier,
            "markdown_path": str(md_out),
            "markdown": markdown,
        })

    print(
        f"  📊 {source_folder}: {skipped} skipped, {reprocessed} parsed, "
        f"{failed_empty} returned empty"
    )
    return results


def extract_all(force: bool = False) -> dict:
    """
    Extract every configured source folder.

    Returns:
        {source_folder: [doc records]}
    """
    all_results = {}

    seen_folders = {
        v["source_folder"]
        for v in config.SECTION_REGISTRY.values()
        if v["source_folder"]
    }

    for folder in seen_folders:
        all_results[folder] = extract_folder(folder, force=force)

    return all_results