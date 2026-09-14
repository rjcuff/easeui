/** Canonical site origin. Override per environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://easeui.dev"
).replace(/\/$/, "");

/** GitHub `owner/repo` slug. */
export const GITHUB_REPO = "rjcuff/easeui";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export const SITE_AUTHOR = "Ryan";
/** Author's X profile. */
export const AUTHOR_X_URL = "https://x.com/ryancuff_";
