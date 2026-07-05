/**
 * safeId — validate a user-supplied identifier before it is used as a
 * filesystem path segment. Prevents path traversal ("../../etc/passwd") and
 * absolute paths in API routes that persist per-user JSON under data/ai/*.
 *
 * Allows a conservative charset (letters, digits, dash, underscore, dot — but
 * NOT ".." and not a leading dot) up to 128 chars. Returns the id if safe,
 * otherwise null so the caller can reject the request.
 */
export function safeId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  if (id.length === 0 || id.length > 128) return null;
  if (id.includes("..") || id.startsWith(".")) return null;
  if (!/^[a-zA-Z0-9._-]+$/.test(id)) return null;
  return id;
}
