import { describe, it } from "node:test";
import assert from "node:assert";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const releaseScript = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "release.sh",
);

interface RunOptions {
  version?: string;
  branch?: string;
  dirty?: boolean;
  buildFail?: boolean;
}

// Runs release.sh in a temp dir with stubbed git/npm/gh executables on PATH.
// Stubs append their invocations to a log file so tests can assert exactly
// which commands the script issued. `node` is not stubbed, so the script's
// package.json version lookup reads the fake package.json for real.
function runRelease(args: string[], opts: RunOptions = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "release-test-"));
  const stubDir = path.join(dir, "stubs");
  const logFile = path.join(dir, "calls.log");
  fs.mkdirSync(stubDir);

  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "moonclock", version: opts.version ?? "0.91.0" }),
  );

  const stubs: Record<string, string> = {
    git: `#!/bin/bash
echo "git $@" >> "$STUB_LOG"
case "$1" in
  status) [ "$STUB_GIT_DIRTY" = "1" ] && echo " M file.txt" ;;
  rev-parse) echo "\${STUB_GIT_BRANCH:-main}" ;;
esac
exit 0
`,
    npm: `#!/bin/bash
echo "npm $@" >> "$STUB_LOG"
if [ "$1" = "run" ] && [ "$2" = "build" ] && [ "$STUB_NPM_BUILD_FAIL" = "1" ]; then
  exit 1
fi
if [ "$1" = "version" ]; then
  echo "v9.9.9"
fi
exit 0
`,
    gh: `#!/bin/bash
echo "gh $@" >> "$STUB_LOG"
exit 0
`,
  };

  for (const [name, content] of Object.entries(stubs)) {
    const stubPath = path.join(stubDir, name);
    fs.writeFileSync(stubPath, content, { mode: 0o755 });
  }

  const result = spawnSync("bash", [releaseScript, ...args], {
    cwd: dir,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${stubDir}:${process.env.PATH}`,
      STUB_LOG: logFile,
      STUB_GIT_BRANCH: opts.branch ?? "main",
      STUB_GIT_DIRTY: opts.dirty ? "1" : "0",
      STUB_NPM_BUILD_FAIL: opts.buildFail ? "1" : "0",
    },
  });

  const log = fs.existsSync(logFile)
    ? fs.readFileSync(logFile, "utf8").trim().split("\n")
    : [];

  fs.rmSync(dir, { recursive: true, force: true });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    log,
  };
}

describe("release.sh", () => {
  describe("argument validation", () => {
    it("exits with usage and no side effects when run without a channel", () => {
      const { status, stderr, log } = runRelease([]);

      assert.equal(status, 1);
      assert.match(stderr, /Usage: bin\/release\.sh <prod\|beta>/);
      assert.deepEqual(log, []);
    });

    it("rejects the old bump-only invocation style", () => {
      const { status, stderr, log } = runRelease(["minor"]);

      assert.equal(status, 1);
      assert.match(stderr, /Usage:/);
      assert.deepEqual(log, []);
    });
  });

  describe("preflight checks", () => {
    it("aborts on a dirty working tree before bumping anything", () => {
      const { status, stderr, log } = runRelease(["prod"], { dirty: true });

      assert.equal(status, 1);
      assert.match(stderr, /uncommitted changes/);
      assert.ok(!log.some((line) => line.startsWith("npm version")));
    });

    it("aborts when not on main", () => {
      const { status, stderr, log } = runRelease(["prod"], {
        branch: "my-feature",
      });

      assert.equal(status, 1);
      assert.match(stderr, /Not on main \(on my-feature\)/);
      assert.ok(!log.some((line) => line.startsWith("npm version")));
    });
  });

  describe("beta channel", () => {
    it("starts a beta line from a stable version with a preminor bump", () => {
      const { status, log } = runRelease(["beta"], { version: "0.91.0" });

      assert.equal(status, 0);
      assert.ok(log.includes("npm version preminor --preid=beta"));
      assert.ok(
        log.includes(
          "gh release create v9.9.9 release.tar.gz --generate-notes --prerelease --verify-tag",
        ),
      );
    });

    it("increments an existing beta line with a prerelease bump", () => {
      const { status, log } = runRelease(["beta"], {
        version: "0.92.0-beta.1",
      });

      assert.equal(status, 0);
      assert.ok(log.includes("npm version prerelease --preid=beta"));
    });

    it("starts a beta line with an explicit base bump", () => {
      const { status, log } = runRelease(["beta", "major"], {
        version: "0.91.0",
      });

      assert.equal(status, 0);
      assert.ok(log.includes("npm version premajor --preid=beta"));
    });
  });

  describe("prod channel", () => {
    it("defaults to a patch bump without the prerelease flag", () => {
      const { status, stdout, log } = runRelease(["prod"], {
        version: "0.91.0",
      });

      assert.equal(status, 0);
      assert.ok(log.includes("npm version patch"));
      assert.ok(
        log.includes(
          "gh release create v9.9.9 release.tar.gz --generate-notes --verify-tag",
        ),
      );
      assert.ok(!stdout.includes("promotes"));
    });

    it("passes an explicit bump through to npm version", () => {
      const { status, log } = runRelease(["prod", "minor"], {
        version: "0.91.0",
      });

      assert.equal(status, 0);
      assert.ok(log.includes("npm version minor"));
    });

    it("prints a promotion notice when releasing from a beta version", () => {
      const { status, stdout, log } = runRelease(["prod"], {
        version: "0.92.0-beta.3",
      });

      assert.equal(status, 0);
      assert.match(stdout, /promotes 0\.92\.0-beta\.3 to a stable release/);
      assert.ok(log.includes("npm version patch"));
      assert.ok(!log.some((line) => line.includes("--prerelease")));
    });
  });

  describe("rollback on failure", () => {
    it("deletes the local tag and commit when the build fails", () => {
      const { status, stderr, log } = runRelease(["beta"], { buildFail: true });

      assert.equal(status, 1);
      assert.match(stderr, /Rolling back local commit and tag/);
      assert.ok(log.includes("git tag -d v9.9.9"));
      assert.ok(log.includes("git reset --hard HEAD~1"));
      assert.ok(!log.some((line) => line.startsWith("git push")));
      assert.ok(!log.some((line) => line.startsWith("gh ")));
    });
  });
});
