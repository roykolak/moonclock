import { describe, it } from "node:test";
import assert from "node:assert";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const verifyScript = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "verify-release",
);

const intactRelease = {
  "package.json": '{"name":"moonclock","version":"0.111.0"}',
  "bin/mc": "#!/bin/bash\n",
  "dist/app/server.js": "process.exit(0)\n",
  "dist/app/package.json": '{"type":"module"}',
  "dist/hardware/index.cjs": "module.exports = {}\n",
};

function createRelease(
  files: Record<string, string>,
  manifest?: string | null,
) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "verify-release-test-"));

  for (const [relativePath, contents] of Object.entries(files)) {
    const absolutePath = path.join(dir, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, contents);
  }

  if (manifest === null) return dir;

  const entries = Object.keys(files).sort();

  fs.writeFileSync(
    path.join(dir, "release-manifest"),
    manifest ?? `${entries.length}\n${entries.join("\n")}\n`,
  );

  return dir;
}

function runVerify(dir: string) {
  const result = spawnSync("bash", [verifyScript, dir], { encoding: "utf8" });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("verify-release", () => {
  it("passes on an intact release", () => {
    const { status, stdout } = runVerify(createRelease(intactRelease));

    assert.equal(status, 0);
    assert.match(stdout, /Verified 5 release files/);
  });

  it("fails when a listed file was flushed empty", () => {
    const dir = createRelease({ ...intactRelease, "dist/app/server.js": "" });
    const { status, stderr } = runVerify(dir);

    assert.equal(status, 1);
    assert.match(stderr, /missing or empty: dist\/app\/server\.js/);
    assert.match(stderr, /1 of 5 release files are missing or empty/);
  });

  it("fails when every file lost its contents", () => {
    const emptied = Object.fromEntries(
      Object.keys(intactRelease).map((file) => [file, ""]),
    );

    const entries = Object.keys(intactRelease).sort();
    const dir = createRelease(
      emptied,
      `${entries.length}\n${entries.join("\n")}\n`,
    );

    const { status, stderr } = runVerify(dir);

    assert.equal(status, 1);
    assert.match(stderr, /5 of 5 release files are missing or empty/);
  });

  it("reports at most five damaged files", () => {
    const files: Record<string, string> = {};
    for (let index = 0; index < 12; index++) files[`dist/f${index}.js`] = "";

    const entries = Object.keys(files).sort();
    const dir = createRelease(
      files,
      `${entries.length}\n${entries.join("\n")}\n`,
    );

    const { status, stderr } = runVerify(dir);

    assert.equal(status, 1);
    assert.equal(stderr.match(/missing or empty:/g)?.length, 5);
    assert.match(stderr, /12 of 12 release files are missing or empty/);
  });

  it("fails when a listed file is absent entirely", () => {
    const dir = createRelease(intactRelease);
    fs.rmSync(path.join(dir, "dist/app/package.json"));

    const { status, stderr } = runVerify(dir);

    assert.equal(status, 1);
    assert.match(stderr, /missing or empty: dist\/app\/package\.json/);
  });

  it("fails when the manifest itself was flushed empty", () => {
    const { status, stderr } = runVerify(createRelease(intactRelease, ""));

    assert.equal(status, 1);
    assert.match(stderr, /Release manifest is missing or empty/);
  });

  it("fails when the manifest is absent", () => {
    const { status, stderr } = runVerify(createRelease(intactRelease, null));

    assert.equal(status, 1);
    assert.match(stderr, /Release manifest is missing or empty/);
  });

  it("fails when the manifest is truncated", () => {
    const dir = createRelease(intactRelease, "5\npackage.json\nbin/mc\n");
    const { status, stderr } = runVerify(dir);

    assert.equal(status, 1);
    assert.match(stderr, /Release manifest is truncated \(2 of 5 entries\)/);
  });

  it("fails when the manifest has no leading count", () => {
    const dir = createRelease(intactRelease, "package.json\nbin/mc\n");
    const { status, stderr } = runVerify(dir);

    assert.equal(status, 1);
    assert.match(stderr, /does not start with a file count/);
  });

  it("exits with a usage error when given no release folder", () => {
    const result = spawnSync("bash", [verifyScript], { encoding: "utf8" });

    assert.equal(result.status, 2);
    assert.match(result.stderr, /Usage: verify-release/);
  });
});
