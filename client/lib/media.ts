export const resolveMediaUrl = (raw?: string | null): string => {
  if (!raw) return "";

  const value = String(raw).trim();
  if (!value) return "";
  if (/^(https?:|data:)/i.test(value)) return value;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const origin = apiBase ? apiBase.replace(/\/api\/?$/, "") : "";
  if (!origin) return "";

  const path = value.startsWith("/") ? value : `/${value}`;
  try {
    return new URL(path, origin).toString();
  } catch {
    return "";
  }
};