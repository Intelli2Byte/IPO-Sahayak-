import json
import config
from core.clients import fireworks_client
from core.retry import with_retry

CLASSIFY_PROMPT = """Classify this document excerpt into exactly one DRHP section key from this list:
{section_keys}

Also return a doc_type (2-4 words, e.g. "balance_sheet", "secretarial_audit", "moa_aoa") and a confidence score 0-1.

Excerpt:
\"\"\"{excerpt}\"\"\"

Output strict minified JSON: {{"drhp_section": "...", "doc_type": "...", "confidence": 0.0}}
"""

@with_retry()
def classify_doc(filename: str, markdown: str, section_keys: list[str]) -> dict:
    excerpt = markdown[:2000]
    resp = fireworks_client.chat.completions.create(
        model=config.FIREWORKS_CLASSIFIER_MODEL,
        messages=[
            {"role": "system", "content": "You are a rigid classifier. Output only minified JSON."},
            {"role": "user", "content": CLASSIFY_PROMPT.format(section_keys=section_keys, excerpt=excerpt)},
        ],
        response_format={"type": "json_object"},
    )
    result = json.loads(resp.choices[0].message.content)
    result["filename"] = filename
    return result

def build_manifest(extracted_by_folder: dict) -> dict:
    section_keys = list(config.SECTION_REGISTRY.keys())
    manifest = {"files": []}
    for folder, docs in extracted_by_folder.items():
        for doc in docs:
            tag = classify_doc(doc["filename"], doc["markdown"], section_keys)
            tag["source_folder"] = folder
            tag["markdown_path"] = doc["markdown_path"]
            manifest["files"].append(tag)
            print(f"  🏷️  {doc['filename']} → {tag['drhp_section']} ({tag['confidence']})")
    config.MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest