import json
import sqlite3
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter
import config

_model = SentenceTransformer(config.LOCAL_EMBEDDING_MODEL)
_splitter = RecursiveCharacterTextSplitter(
    chunk_size=config.CHUNK_SIZE, chunk_overlap=config.CHUNK_OVERLAP,
    separators=["\n\n", "\n", ". ", " "]
)

def _init_db():
    conn = sqlite3.connect(config.METADATA_DB_PATH)
    conn.execute("""CREATE TABLE IF NOT EXISTS chunks (
        chunk_id INTEGER PRIMARY KEY,
        filename TEXT, drhp_section TEXT, doc_type TEXT,
        source_folder TEXT, text TEXT
    )""")
    conn.commit()
    return conn

def build_index(manifest: dict):
    """Chunk + embed every classified file, store vectors in FAISS and metadata in SQLite."""
    conn = _init_db()
    all_chunks, metas = [], []

    for entry in manifest["files"]:
        markdown = open(entry["markdown_path"], encoding="utf-8").read()
        chunks = _splitter.split_text(markdown)
        for c in chunks:
            all_chunks.append(c)
            metas.append({
                "filename": entry["filename"],
                "drhp_section": entry["drhp_section"],
                "doc_type": entry["doc_type"],
                "source_folder": entry["source_folder"],
            })

    if not all_chunks:
        print("⚠️ No chunks to index.")
        return

    embeddings = _model.encode(all_chunks, show_progress_bar=True, normalize_embeddings=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(np.array(embeddings, dtype="float32"))
    faiss.write_index(index, str(config.FAISS_INDEX_PATH))

    conn.execute("DELETE FROM chunks")
    for i, (text, meta) in enumerate(zip(all_chunks, metas)):
        conn.execute(
            "INSERT INTO chunks (chunk_id, filename, drhp_section, doc_type, source_folder, text) VALUES (?,?,?,?,?,?)",
            (i, meta["filename"], meta["drhp_section"], meta["doc_type"], meta["source_folder"], text)
        )
    conn.commit()
    conn.close()
    print(f"✅ Indexed {len(all_chunks)} chunks into FAISS + metadata_store.sqlite")

def query_section(query: str, drhp_section: str, k: int = 8) -> list[str]:
    """Retrieve top-k chunks, filtered to a specific drhp_section via the SQLite sidecar."""
    if not config.FAISS_INDEX_PATH.exists():
        return []
    index = faiss.read_index(str(config.FAISS_INDEX_PATH))
    conn = _init_db()

    q_vec = _model.encode([query], normalize_embeddings=True).astype("float32")
    scores, ids = index.search(q_vec, min(k * 5, index.ntotal))  # over-fetch then filter

    results = []
    for idx in ids[0]:
        if idx == -1:
            continue
        row = conn.execute("SELECT text, drhp_section FROM chunks WHERE chunk_id=?", (int(idx),)).fetchone()
        if row and row[1] == drhp_section:
            results.append(row[0])
        if len(results) >= k:
            break
    conn.close()
    return results
