import json
import re
from datetime import datetime
import config

def next_version(target_dir, base_name: str) -> tuple[int, str]:
    """Finds existing {base_name}_v{N}.pdf files and returns next version number + filename."""
    pattern = re.compile(rf"{re.escape(base_name)}_v(\d+)\.pdf$")
    existing = []
    for f in target_dir.glob(f"{base_name}_v*.pdf"):
        m = pattern.search(f.name)
        if m:
            existing.append(int(m.group(1)))
    n = max(existing, default=0) + 1
    return n, f"{base_name}_v{n}.pdf"

def log_changelog(section_key: str, version: int, accuracy: float, source_files: list[str]):
    changelog_path = config.VERSIONS_DIR / "changelog.json"
    entries = []
    if changelog_path.exists():
        entries = json.loads(changelog_path.read_text(encoding="utf-8"))
    entries.append({
        "timestamp": datetime.utcnow().isoformat(),
        "section": section_key,
        "version": version,
        "accuracy": accuracy,
        "source_files": source_files,
    })
    changelog_path.write_text(json.dumps(entries, indent=2), encoding="utf-8")