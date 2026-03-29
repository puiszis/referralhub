const PUBLIC_DEAL_FIELDS = [
  "slug", "title", "storeName", "descriptionShort", "descriptionLong",
  "imageEmoji", "imageUrl", "creditType", "creditValueUser",
  "tags", "featured", "status", "dateAdded", "dateModified",
  "expiresAt", "clickCount", "category",
] as const;

export function sanitizeDealForPublic(deal: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const key of PUBLIC_DEAL_FIELDS) {
    if (key in deal) clean[key] = deal[key];
  }
  return clean;
}

const ALLOWED_REDIRECT_PROTOCOLS = ["https:", "http:"];

export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_REDIRECT_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

const BLOCKED_SSRF_PATTERNS = [
  /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/i,
  /^https?:\/\/10\.\d+\.\d+\.\d+/,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/,
  /^https?:\/\/192\.168\.\d+\.\d+/,
  /^https?:\/\/169\.254\.\d+\.\d+/,
  /^https?:\/\/[^/]*\.local(:\d+)?(\/|$)/i,
  /^https?:\/\/[^/]*\.internal(:\d+)?(\/|$)/i,
];

export function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) return false;
    for (const pattern of BLOCKED_SSRF_PATTERNS) {
      if (pattern.test(url)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";
  return input.trim().substring(0, maxLength);
}

export function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase().substring(0, 254);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) return null;
  return email;
}

export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = parseInt(String(value));
  if (isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export function safeErrorMessage(e: unknown, fallbackMessage: string): string {
  if (e && typeof e === "object" && "code" in e) {
    const code = (e as { code: string }).code;
    if (code === "P2002") return "A record with this identifier already exists";
    if (code === "P2025") return "Record not found";
    if (code === "P2003") return "Referenced record does not exist";
  }
  return fallbackMessage;
}
