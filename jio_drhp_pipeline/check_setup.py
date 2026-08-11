from config import (
    LLAMA_CLOUD_API_KEY,
    FIREWORKS_API_KEY,
    SEBI_LOGO_PATH,
    SECTION_REGISTRY,
    RAW_INPUTS_DIR,
)


# ============================================================
# API KEY CHECK
# ============================================================

print(
    "✅ LLAMA_CLOUD_API_KEY loaded:",
    bool(LLAMA_CLOUD_API_KEY),
)

print(
    "✅ FIREWORKS_API_KEY loaded:",
    bool(FIREWORKS_API_KEY),
)


# ============================================================
# SEBI LOGO CHECK
# ============================================================

print(
    "⚠️  SEBI logo present:",
    SEBI_LOGO_PATH.exists(),
    f"({SEBI_LOGO_PATH})",
)


# ============================================================
# SECTION CHECK
# ============================================================

for key, meta in SECTION_REGISTRY.items():

    source_folder = meta.get("source_folder")
    status = meta.get("status", "pending_input")
    display_name = meta.get("display_name", key)

    # --------------------------------------------------------
    # No source folder
    # --------------------------------------------------------

    if not source_folder:
        print(
            f"🟡 {key} ({display_name}): "
            f"pending_input, no source folder"
        )
        continue

    # --------------------------------------------------------
    # Source folder
    # --------------------------------------------------------

    folder = RAW_INPUTS_DIR / source_folder

    count = (
        len(list(folder.glob("*.pdf")))
        if folder.exists()
        else 0
    )

    # --------------------------------------------------------
    # Respect the configured status
    # --------------------------------------------------------

    if status == "pending_input":

        print(
            f"🟡 {key} ({display_name}): "
            f"pending_input, {count} PDFs in {folder}"
        )

    elif status == "ready":

        if count > 0:
            print(
                f"🟢 {key} ({display_name}): "
                f"{count} PDFs in {folder}"
            )
        else:
            print(
                f"🔴 {key} ({display_name}): "
                f"ready, but no PDFs found in {folder}"
            )

    else:

        print(
            f"⚠️  {key} ({display_name}): "
            f"unknown status '{status}', "
            f"{count} PDFs in {folder}"
        )