import { DocumentItem, DocumentVault } from '@/data/mockData';

/**
 * Returns only approved/finalized documents, using the project's existing
 * `DocumentItem.status` field ("approved" | "under_review" | "pending" | "rejected").
 *
 * Version safety: if multiple approved documents share the same logical
 * document name (e.g. two approved revisions), only the latest version is
 * kept, so drafts/reviews/older approved cuts never leak into the dropdown.
 */
export function getApprovedDocuments(vault: DocumentVault): DocumentItem[] {
  const approved = vault.categories
    .flatMap((category) => category.documents)
    .filter((doc) => doc.status === 'approved');

  const latestByName = new Map<string, DocumentItem>();

  for (const doc of approved) {
    const key = doc.name.trim().toLowerCase();
    const existing = latestByName.get(key);

    if (!existing) {
      latestByName.set(key, doc);
      continue;
    }

    const existingVersion = existing.version ?? 0;
    const docVersion = doc.version ?? 0;

    const isNewer =
      docVersion > existingVersion ||
      (docVersion === existingVersion &&
        new Date(doc.uploadedAt).getTime() > new Date(existing.uploadedAt).getTime());

    if (isNewer) {
      latestByName.set(key, doc);
    }
  }

  return Array.from(latestByName.values()).sort((a, b) =>
    a.fileName.localeCompare(b.fileName)
  );
}
