from rapidfuzz import fuzz
import json
import config

def _flatten_values(obj) -> list[str]:
    values = []
    if isinstance(obj, dict):
        for v in obj.values():
            values.extend(_flatten_values(v))
    elif isinstance(obj, list):
        for v in obj:
            values.extend(_flatten_values(v))
    elif obj is not None:
        values.append(str(obj))
    return values

def validate_section(section_data: dict, source_markdown: str, section_key: str) -> dict:
    """Fuzzy-matches every extracted value against the source markdown. Fails if match rate < threshold."""
    values = [v for v in _flatten_values(section_data) if len(v) > 2]
    if not values:
        return {"section": section_key, "match_rate": 0.0, "passed": False, "checked": 0}

    matched = 0
    for v in values:
        # partial ratio handles formatting differences (e.g. "₹1,234.5 Cr" vs "1234.5")
        if fuzz.partial_ratio(v, source_markdown) >= 85:
            matched += 1

    match_rate = matched / len(values)
    result = {
        "section": section_key,
        "match_rate": round(match_rate, 4),
        "passed": match_rate >= config.ACCURACY_THRESHOLD,
        "checked": len(values),
        "matched": matched,
    }
    out_path = config.VALIDATION_DIR / f"{section_key}_accuracy.json"
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    return result