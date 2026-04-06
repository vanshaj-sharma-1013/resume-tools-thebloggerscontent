/**
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yourdomain.com) so
 * Open Graph URLs and metadataBase resolve correctly.
 */
export const SITE_NAME = "Resume Tools";
export const SITE_BRAND = "thebloggerscontent";

/** Public contact address; override with NEXT_PUBLIC_CONTACT_EMAIL in production. */
export const SITE_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  "thebloggerscontentofficial@gmail.com";

export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && /^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, "");
  }
  return "https://thebloggerscontent.com";
}

export const defaultDescription =
  "Free resume builder and free resume maker with professional themes, ATS-friendly structure, and instant PDF preview. No login, no subscription, no watermark — build your resume in your browser with free resume tools.";
