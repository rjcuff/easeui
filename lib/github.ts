import { GITHUB_REPO } from "@/lib/site";

const GITHUB_REPO_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;

/** Below this, the count reads as evidence against the project rather than social proof — hide it instead. Raise it as the repo grows. */
const MIN_DISPLAYED_STARS = 50;

export async function getGithubStarCount(): Promise<number | null> {
  try {
    const response = await fetch(GITHUB_REPO_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 60 * 60,
      },
    });

    if (!response.ok) return null;

    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "stargazers_count" in data &&
      typeof data.stargazers_count === "number"
    ) {
      return data.stargazers_count >= MIN_DISPLAYED_STARS ? data.stargazers_count : null;
    }
  } catch {
    return null;
  }

  return null;
}
