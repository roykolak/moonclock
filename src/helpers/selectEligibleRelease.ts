import semver from "semver";
import { UpdateChannel } from "@/types";

export interface GithubReleaseAsset {
  browser_download_url: string;
}

export interface GithubRelease {
  tag_name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  assets: GithubReleaseAsset[];
}

export interface EligibleRelease {
  version: string;
  release: GithubRelease;
  asset: GithubReleaseAsset;
}

export function selectEligibleRelease(
  releases: GithubRelease[],
  channel: UpdateChannel,
  currentVersion: string,
): EligibleRelease | null {
  const candidates = (Array.isArray(releases) ? releases : [])
    .filter((release) => !release.draft)
    .filter((release) => channel === "beta" || !release.prerelease)
    .filter((release) => release.assets?.length > 0)
    .map((release) => ({
      release,
      version: semver.valid(semver.clean(release.tag_name) ?? ""),
    }))
    .filter(
      (candidate): candidate is { release: GithubRelease; version: string } =>
        candidate.version !== null &&
        semver.gt(candidate.version, currentVersion),
    )
    .sort((a, b) => semver.rcompare(a.version, b.version));

  const best = candidates[0];

  if (!best) return null;

  return {
    version: best.version,
    release: best.release,
    asset: best.release.assets[0],
  };
}
