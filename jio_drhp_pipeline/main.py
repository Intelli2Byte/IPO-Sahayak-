import importlib
import config
from core.extractor import extract_all
from core.classifier import build_manifest
from core.vector_engine import build_index
from core.layout_engine import load_or_build_layout_template
from core.compiler import merge_final
from core.versioning import next_version


def main():
    print("=== STEP 1: Extraction ===")
    extracted_by_folder = extract_all()

    print("\n=== STEP 2: Classification ===")
    manifest = build_manifest(extracted_by_folder)

    print("\n=== STEP 3: Vector Indexing ===")
    build_index(manifest)

    print("\n=== STEP 4: Layout Template ===")
    all_markdowns = [d["markdown"] for docs in extracted_by_folder.values() for d in docs]
    layout_template = load_or_build_layout_template(all_markdowns)

    print("\n=== STEP 5: Section Generation ===")
    section_pdfs = []
    for section_key, meta in config.SECTION_REGISTRY.items():
        if meta["status"] != "ready":
            print(f"🟡 Skipping {section_key} ({meta['display_name']}) — pending_input")
            continue

        module_name = f"sections_pipeline.{section_key}.runner"
        try:
            runner_mod = importlib.import_module(module_name)
        except ModuleNotFoundError:
            print(f"⚠️ No runner.py implemented yet for {section_key}")
            continue

        result = runner_mod.run(layout_template)
        if result and result.get("pdf_path"):
            section_pdfs.append(result["pdf_path"])

    print("\n=== STEP 6: Final Compile ===")
    if section_pdfs:
        version, filename = next_version(config.VERSIONS_DIR, "Jio_DRHP_Final")
        final_path = config.VERSIONS_DIR / filename
        merge_final(section_pdfs, str(final_path))
        print(f"🎉 Final DRHP compiled: {final_path}")
    else:
        print("❌ No sections passed validation — final PDF not compiled.")


if __name__ == "__main__":
    main()