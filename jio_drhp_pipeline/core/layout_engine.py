import json
import config
from core.clients import fireworks_client
from core.retry import with_retry

LAYOUT_PROMPT_TEMPLATE = """You are an expert document design parser for SEBI-compliant prospectuses.
Analyze the Markdown below and output ONLY a JSON object with keys "page_geometry", "typography", "table_rules".
Do not extract narrative content, names, or figures — layout rules only.

Reference Document Content Stream:
\"\"\"{sample}\"\"\"

Output strict minified JSON only.
"""

@with_retry()
def _analyze_one(sample_markdown: str) -> dict:
    resp = fireworks_client.chat.completions.create(
        model=config.FIREWORKS_LAYOUT_MODEL,
        messages=[
            {"role": "system", "content": "Rigid data utility parser. Output only pure JSON."},
            {"role": "user", "content": LAYOUT_PROMPT_TEMPLATE.format(sample=sample_markdown[:12000])},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)

def _merge_numeric(values, default):
    nums = [v for v in values if isinstance(v, (int, float))]
    return sum(nums) / len(nums) if nums else default

def build_layout_template(reference_markdowns: list[str]) -> dict:
    """Runs layout analysis on ALL reference docs (not just doc[0]) and merges via median-ish averaging."""
    analyses = [_analyze_one(md) for md in reference_markdowns if md.strip()]
    if not analyses:
        raise ValueError("No reference markdown available for layout analysis.")

    merged = analyses[0]  # structure baseline
    # Average numeric leaf values across analyses for stability
    def merge_dicts(dicts):
        keys = dicts[0].keys()
        out = {}
        for k in keys:
            vals = [d.get(k) for d in dicts if k in d]
            if isinstance(vals[0], dict):
                out[k] = merge_dicts(vals)
            elif isinstance(vals[0], (int, float)):
                out[k] = _merge_numeric(vals, vals[0])
            else:
                out[k] = vals[0]  # take first for strings/enums
        return out

    merged = merge_dicts(analyses)
    cache_path = config.OUTPUT_REPORTS_DIR / "layout_template.json"
    cache_path.write_text(json.dumps(merged, indent=2), encoding="utf-8")
    return merged

def load_or_build_layout_template(reference_markdowns: list[str]) -> dict:
    cache_path = config.OUTPUT_REPORTS_DIR / "layout_template.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))
    return build_layout_template(reference_markdowns)