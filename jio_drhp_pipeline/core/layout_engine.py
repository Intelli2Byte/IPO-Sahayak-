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
    

def load_or_build_layout_template(reference_markdowns: list[str]) -> dict:
    cache_path = config.OUTPUT_REPORTS_DIR / "layout_template.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))
    return build_layout_template(reference_markdowns)
def merge_dicts(dicts):
    """Merge a list of dicts key-by-key. Defensive against LLM output
    where the same key may come back as different types across samples
    (e.g. a nested dict in one analysis, a plain string in another)."""
    # Only dicts can be merged this way; if something upstream passed a
    # non-dict, just return it as-is (shouldn't normally happen at the
    # top level, but guards against bad recursion).
    dicts = [d for d in dicts if isinstance(d, dict)]
    if not dicts:
        return {}

    keys = dicts[0].keys()
    out = {}
    for k in keys:
        vals = [d.get(k) for d in dicts if k in d]
        vals = [v for v in vals if v is not None]
        if not vals:
            continue

        # Only recurse if ALL values for this key are dicts.
        if all(isinstance(v, dict) for v in vals):
            out[k] = merge_dicts(vals)
        # Only average if ALL values are numeric.
        elif all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in vals):
            out[k] = _merge_numeric(vals, vals[0])
        # Mixed types or strings/lists/bools: take the first non-null value.
        else:
            out[k] = vals[0]
    return out
