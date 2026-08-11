import json

import config
from core.clients import fireworks_client
from core.vector_engine import query_section
from core.compiler import render_section_pdf
from core.watermark import apply_watermark
from core.versioning import next_version, log_changelog
from core.validator import validate_section

from .prompts import CAPITAL_STRUCTURE_MAPPING_PROMPT


SECTION_KEY = "07_capital_structure"


QUERIES = [
    "capital structure authorized issued subscribed paid up share capital",
    "promoter shareholding pattern promoter group number of shares percentage",
    "shareholding pattern public shareholders institutional shareholders mutual funds",
    "pre issue post issue shareholding pattern percentage",
    "specified securities issue shareholding before and after issue",
]


def run(layout_template: dict):
    reg = config.SECTION_REGISTRY[SECTION_KEY]

    if reg["status"] != "ready":
        print(f"🟡 {SECTION_KEY} is pending input — skipped.")
        return None

    out_dir = config.SECTIONS_OUT_DIR / SECTION_KEY
    out_dir.mkdir(parents=True, exist_ok=True)

    all_chunks = []

    for q in QUERIES:
        all_chunks.extend(
            query_section(
                q,
                drhp_section=SECTION_KEY,
                k=6,
            )
        )

    combined_context = "\n\n".join(all_chunks)

    if not combined_context.strip():
        print(f"  ⚠️  No indexed chunks found for {SECTION_KEY} — skipping.")
        return None

    # NOTE: using .replace() instead of .format() — the prompt contains
    # a literal JSON example with unescaped { } characters, which would
    # break .format()'s field-substitution logic.
    prompt = CAPITAL_STRUCTURE_MAPPING_PROMPT.replace(
        "__LAYOUT_TEMPLATE__",
        json.dumps(layout_template, ensure_ascii=False, indent=2),
    ).replace(
        "__CHUNKS__",
        combined_context[:18000],
    )

    resp = fireworks_client.chat.completions.create(
        model=config.FIREWORKS_CONTENT_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Rigid deterministic capital structure parser. "
                    "Output only valid JSON."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        response_format={"type": "json_object"},
        timeout=180.0,
    )

    mapped_json = json.loads(
        resp.choices[0].message.content
    )

    data_path = out_dir / "section_data.json"

    data_path.write_text(
        json.dumps(
            mapped_json,
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    accuracy_result = validate_section(
        mapped_json,
        combined_context,
        SECTION_KEY,
    )

    print(
        f"  📊 Accuracy: "
        f"{accuracy_result['match_rate'] * 100:.1f}% "
        f"(threshold "
        f"{config.ACCURACY_THRESHOLD * 100:.0f}%)"
    )

    if not accuracy_result["passed"]:
        print(
            f"  ❌ FAILED accuracy gate for "
            f"{SECTION_KEY} — not rendering PDF."
        )
        return accuracy_result

    version, filename = next_version(
        out_dir,
        "Capital_Structure",
    )

    raw_pdf = out_dir / f"_raw_{filename}"
    final_pdf = out_dir / filename

    render_section_pdf(
        mapped_json,
        str(raw_pdf),
    )

    apply_watermark(
        str(raw_pdf),
        str(final_pdf),
    )

    raw_pdf.unlink(missing_ok=True)

    log_changelog(
        SECTION_KEY,
        version,
        accuracy_result["match_rate"],
        [],
    )

    print(f"  ✅ {final_pdf}")

    return {
        "pdf_path": str(final_pdf),
        **accuracy_result,
    }