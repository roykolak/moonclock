import { describe, it } from "node:test";
import assert from "node:assert";
import { panelNameVocabulary, randomPanelName } from "./panelName";

const { adjectives, nouns } = panelNameVocabulary;

describe("randomPanelName", () => {
  it("pairs one adjective with one noun", () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const [adjective, noun, ...rest] = randomPanelName().split(" ");

      assert.deepStrictEqual(rest, []);
      assert.ok(adjectives.includes(adjective), adjective);
      assert.ok(nouns.includes(noun), noun);
    }
  });

  it("gives clocks on the same network different names", () => {
    const names = new Set(Array.from({ length: 50 }, () => randomPanelName()));

    assert.ok(names.size > 40, `only ${names.size} distinct names in 50`);
  });

  it("draws from a vocabulary with no word in both halves", () => {
    const shared = adjectives.filter((word) => nouns.includes(word));

    assert.deepStrictEqual(shared, []);
  });
});
