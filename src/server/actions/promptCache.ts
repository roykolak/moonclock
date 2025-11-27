"use server";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const CACHE_FILE_PATH = path.join(process.cwd(), "prompt.json");

interface PromptCacheEntry {
  prompt: string;
  coordinates: { [key: string]: string };
  timestamp: number;
}

interface PromptCache {
  [promptHash: string]: PromptCacheEntry;
}

function hashPrompt(prompt: string): string {
  return crypto.createHash("sha256").update(prompt.trim().toLowerCase()).digest("hex");
}

async function ensureCacheFile(): Promise<void> {
  try {
    await fs.access(CACHE_FILE_PATH);
  } catch {
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify({}, null, 2));
  }
}

export async function getCachedPrompt(
  prompt: string
): Promise<{ [key: string]: string } | null> {
  try {
    await ensureCacheFile();
    const cacheContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const cache: PromptCache = JSON.parse(cacheContent);
    const promptHash = hashPrompt(prompt);

    const entry = cache[promptHash];
    if (entry) {
      console.log(`Cache hit for prompt: "${prompt}"`);
      return entry.coordinates;
    }

    console.log(`Cache miss for prompt: "${prompt}"`);
    return null;
  } catch (error) {
    console.error("Error reading prompt cache:", error);
    return null;
  }
}

export async function setCachedPrompt(
  prompt: string,
  coordinates: { [key: string]: string }
): Promise<void> {
  try {
    await ensureCacheFile();
    const cacheContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const cache: PromptCache = JSON.parse(cacheContent);
    const promptHash = hashPrompt(prompt);

    cache[promptHash] = {
      prompt: prompt.trim(),
      coordinates,
      timestamp: Date.now(),
    };

    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
    console.log(`Cached result for prompt: "${prompt}"`);
  } catch (error) {
    console.error("Error writing prompt cache:", error);
  }
}
