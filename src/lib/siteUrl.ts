/** Canonical public origin (no trailing slash). Use www — apex redirects here. */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.zaybaash.com'
).replace(/\/$/, '');
