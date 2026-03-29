import { sanitizeString, isValidRedirectUrl } from "./sanitize";

interface DealInput {
  title?: unknown;
  slug?: unknown;
  storeName?: unknown;
  storeUrl?: unknown;
  referralUrl?: unknown;
  referralCode?: unknown;
  categoryId?: unknown;
  descriptionShort?: unknown;
  descriptionLong?: unknown;
  creditType?: unknown;
  creditValueUser?: unknown;
  creditValueOperator?: unknown;
  imageEmoji?: unknown;
  imageUrl?: unknown;
  tags?: unknown;
  featured?: unknown;
  status?: unknown;
  expiresAt?: unknown;
  source?: unknown;
  notes?: unknown;
}

const VALID_STATUSES = ["draft", "active", "paused", "expired", "archived"];
const VALID_SOURCES = ["manual", "scraped", "submitted"];

export function validateDealInput(body: DealInput, isUpdate = false) {
  const errors: string[] = [];

  if (!isUpdate) {
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push("title is required");
    }
    if (!body.storeName || typeof body.storeName !== "string") {
      errors.push("storeName is required");
    }
    if (!body.referralUrl || typeof body.referralUrl !== "string") {
      errors.push("referralUrl is required");
    }
    if (!body.categoryId || typeof body.categoryId !== "string") {
      errors.push("categoryId is required");
    }
    if (!body.descriptionShort || typeof body.descriptionShort !== "string") {
      errors.push("descriptionShort is required");
    }
  }

  if (body.referralUrl && typeof body.referralUrl === "string") {
    if (!isValidRedirectUrl(body.referralUrl)) {
      errors.push("referralUrl must be a valid http/https URL");
    }
  }

  if (body.storeUrl && typeof body.storeUrl === "string") {
    if (!isValidRedirectUrl(body.storeUrl)) {
      errors.push("storeUrl must be a valid http/https URL");
    }
  }

  if (body.status && typeof body.status === "string") {
    if (!VALID_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
  }

  if (body.source && typeof body.source === "string") {
    if (!VALID_SOURCES.includes(body.source)) {
      errors.push(`source must be one of: ${VALID_SOURCES.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false as const, errors };
  }

  return { valid: true as const, errors: [] };
}

export function sanitizeDealData(body: DealInput) {
  return {
    title: sanitizeString(body.title, 200),
    storeName: sanitizeString(body.storeName, 200),
    storeUrl: body.storeUrl ? sanitizeString(body.storeUrl, 2000) : null,
    referralUrl: sanitizeString(body.referralUrl, 2000),
    referralCode: body.referralCode ? sanitizeString(body.referralCode, 100) : null,
    categoryId: sanitizeString(body.categoryId, 100),
    descriptionShort: sanitizeString(body.descriptionShort, 160),
    descriptionLong: body.descriptionLong ? sanitizeString(body.descriptionLong, 10000) : null,
    creditType: body.creditType ? sanitizeString(body.creditType, 200) : null,
    creditValueUser: Math.max(0, Math.min(parseFloat(String(body.creditValueUser)) || 0, 100000)),
    creditValueOperator: Math.max(0, Math.min(parseFloat(String(body.creditValueOperator)) || 0, 100000)),
    imageEmoji: sanitizeString(body.imageEmoji, 4) || "🔗",
    tags: JSON.stringify(
      Array.isArray(body.tags)
        ? body.tags.filter((t): t is string => typeof t === "string").map((t) => t.substring(0, 50)).slice(0, 20)
        : []
    ),
    featured: body.featured === true,
    status: VALID_STATUSES.includes(String(body.status)) ? String(body.status) : "draft",
    expiresAt: body.expiresAt ? new Date(String(body.expiresAt)) : null,
    source: VALID_SOURCES.includes(String(body.source)) ? String(body.source) : "manual",
    notes: body.notes ? sanitizeString(body.notes, 5000) : null,
  };
}
