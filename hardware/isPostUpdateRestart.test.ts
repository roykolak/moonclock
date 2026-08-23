import { afterEach, describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import os from "os";
import path from "path";
import { isPostUpdateRestart } from "./isPostUpdateRestart";

const dirs: string[] = [];

function symlinkAgedBySeconds(seconds: number) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "moonclock-symlink-"));
  dirs.push(dir);

  const release = path.join(dir, "release");
  const link = path.join(dir, "current");
  fs.mkdirSync(release);
  fs.symlinkSync(release, link);

  const when = new Date(Date.now() - seconds * 1000);
  fs.lutimesSync(link, when, when);

  return link;
}

afterEach(() => {
  while (dirs.length) fs.rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("isPostUpdateRestart", () => {
  it("is true for a symlink repointed moments ago", () => {
    assert.equal(isPostUpdateRestart(60, symlinkAgedBySeconds(2)), true);
  });

  it("is false once the symlink is older than the threshold", () => {
    assert.equal(isPostUpdateRestart(60, symlinkAgedBySeconds(600)), false);
  });

  it("is false when there is no symlink, as on a dev machine", () => {
    assert.equal(isPostUpdateRestart(60, "/nope/moonclock/current"), false);
  });

  it("reads the link's own mtime, not the release folder's", () => {
    const link = symlinkAgedBySeconds(600);

    const now = new Date();
    fs.utimesSync(fs.realpathSync(link), now, now);

    assert.equal(isPostUpdateRestart(60, link), false);
  });
});
