import { describe, it } from "node:test";
import assert from "node:assert";
import { GithubRelease, selectEligibleRelease } from "./selectEligibleRelease";

function buildRelease(overrides: Partial<GithubRelease>): GithubRelease {
  return {
    tag_name: "0.1.0",
    body: "Release notes",
    draft: false,
    prerelease: false,
    assets: [{ browser_download_url: "https://example.com/release.tar.gz" }],
    ...overrides,
  };
}

describe("selectEligibleRelease", () => {
  describe("stable channel", () => {
    it("skips prereleases and drafts", () => {
      const releases = [
        buildRelease({ tag_name: "0.93.0-beta.0", prerelease: true }),
        buildRelease({ tag_name: "0.94.0", draft: true }),
        buildRelease({ tag_name: "0.92.0" }),
      ];

      const result = selectEligibleRelease(releases, "stable", "0.91.0");

      assert.equal(result?.version, "0.92.0");
    });

    it("returns null when the only newer releases are prereleases", () => {
      const releases = [
        buildRelease({ tag_name: "0.92.0-beta.0", prerelease: true }),
        buildRelease({ tag_name: "0.91.0" }),
      ];

      const result = selectEligibleRelease(releases, "stable", "0.91.0");

      assert.equal(result, null);
    });

    it("never offers a downgrade after switching off beta", () => {
      const releases = [
        buildRelease({ tag_name: "0.92.0-beta.1", prerelease: true }),
        buildRelease({ tag_name: "0.91.0" }),
      ];

      const result = selectEligibleRelease(releases, "stable", "0.92.0-beta.1");

      assert.equal(result, null);
    });
  });

  describe("beta channel", () => {
    it("picks the prerelease when it is the highest version", () => {
      const releases = [
        buildRelease({ tag_name: "0.92.0-beta.1", prerelease: true }),
        buildRelease({ tag_name: "0.91.0" }),
      ];

      const result = selectEligibleRelease(releases, "beta", "0.91.0");

      assert.equal(result?.version, "0.92.0-beta.1");
    });

    it("orders beta increments numerically", () => {
      const releases = [
        buildRelease({ tag_name: "0.92.0-beta.9", prerelease: true }),
        buildRelease({ tag_name: "0.92.0-beta.10", prerelease: true }),
      ];

      const result = selectEligibleRelease(releases, "beta", "0.92.0-beta.9");

      assert.equal(result?.version, "0.92.0-beta.10");
    });

    it("picks a stable release that outranks the newest beta", () => {
      const releases = [
        buildRelease({ tag_name: "0.92.0" }),
        buildRelease({ tag_name: "0.92.0-beta.1", prerelease: true }),
      ];

      const result = selectEligibleRelease(releases, "beta", "0.92.0-beta.1");

      assert.equal(result?.version, "0.92.0");
    });
  });

  it("returns null when already on the latest version", () => {
    const releases = [buildRelease({ tag_name: "0.91.0" })];

    const result = selectEligibleRelease(releases, "stable", "0.91.0");

    assert.equal(result, null);
  });

  it("picks the highest version even when it is not first in the list", () => {
    const releases = [
      buildRelease({ tag_name: "0.92.0" }),
      buildRelease({ tag_name: "0.93.0" }),
    ];

    const result = selectEligibleRelease(releases, "stable", "0.91.0");

    assert.equal(result?.version, "0.93.0");
  });

  it("skips releases without assets", () => {
    const releases = [
      buildRelease({ tag_name: "0.93.0", assets: [] }),
      buildRelease({ tag_name: "0.92.0" }),
    ];

    const result = selectEligibleRelease(releases, "stable", "0.91.0");

    assert.equal(result?.version, "0.92.0");
    assert.equal(
      result?.asset.browser_download_url,
      "https://example.com/release.tar.gz",
    );
  });

  it("handles v-prefixed tags and ignores junk tags", () => {
    const releases = [
      buildRelease({ tag_name: "nightly-build" }),
      buildRelease({ tag_name: "v0.92.0" }),
    ];

    const result = selectEligibleRelease(releases, "stable", "0.91.0");

    assert.equal(result?.version, "0.92.0");
  });

  it("returns null for a non-array payload", () => {
    const rateLimitError = {
      message: "API rate limit exceeded",
    } as unknown as GithubRelease[];

    const result = selectEligibleRelease(rateLimitError, "stable", "0.91.0");

    assert.equal(result, null);
  });
});
