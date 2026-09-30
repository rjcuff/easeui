/** Canonical site origin. Override per environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://easeui.dev"
).replace(/\/$/, "");

/** GitHub `owner/repo` slug. */
export const GITHUB_REPO = "rjcuff/easeui";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

/** The Pro catalog, which lives on its own domain. */
export const PRO_URL = "https://pro.easeui.dev";

/** A Pro link tagged with where it was clicked, so Pro's analytics show which spot on this site sent the visit. */
export function proUrl(path = "", placement = "site"): string {
  return `${PRO_URL}${path}?utm_source=easeui&utm_medium=${placement}`;
}

export const SITE_AUTHOR = "Ryan";
/** Author's X profile. */
export const AUTHOR_X_URL = "https://x.com/ryancuff_";
