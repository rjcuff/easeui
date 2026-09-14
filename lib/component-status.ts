/** How long a launch keeps its "new" marker, in ms. */
export const NEW_BADGE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

type Launch = { badge?: "new"; launchedAt?: string };

/**
 * Milliseconds left in a launch's "new" window. Scheduled launches count the
 * time until launch as well. Returns 0 when there is no valid launch date.
 */
export function getNewBadgeRemainingMs(launchedAt?: string, now = Date.now()): number {
  if (!launchedAt) return 0;
  const launch = Date.parse(`${launchedAt}T00:00:00Z`);
  if (Number.isNaN(launch)) return 0;
  return Math.max(0, launch + NEW_BADGE_DURATION_MS - now);
}

/** A component is new when it is marked new and still inside its launch window. */
export function isComponentNew(component: Launch, now = Date.now()): boolean {
  return component.badge === "new" && getNewBadgeRemainingMs(component.launchedAt, now) > 0;
}
