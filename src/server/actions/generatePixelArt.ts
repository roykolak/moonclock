"use server";

import Anthropic from "@anthropic-ai/sdk";
import { getData } from "../db";

export async function generatePixelArt(description: string) {
  const { panel } = getData();
  const apiKey = panel.anthropicApiKey;

  if (!apiKey) {
    return {
      success: false,
      error: "Anthropic API key not configured. Please add it in Settings.",
    };
  }

  const anthropic = new Anthropic({
    apiKey,
  });
  const prompt = `You are a pixel art generator for a 32x32 LED matrix display. Generate pixel art based on the user's description.

User description: "${description}"

Return a JSON object where keys are coordinates in the format "x:y" (where x and y are 0-31) and values are hex color codes (e.g., "#FF0000").

Rules:
- Only include pixels that should be colored (empty pixels are omitted)
- Use appropriate colors that match the description
- Consider the 32x32 grid size when designing
- Keep designs simple and recognizable at this resolution
- Keep the colors SIMPLE and use high saturation
- Return ONLY valid JSON, no additional text

Example format:
{
  "0:0": "#FF0000",
  "1:0": "#FF0000",
  "0:1": "#00FF00"
}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from API");
    }

    // Extract JSON from the response (in case Claude wraps it in markdown)
    let jsonText = textContent.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    console.log(jsonText);

    const coordinates = JSON.parse(jsonText);
    return { success: true, coordinates };
  } catch (error) {
    console.error("Error generating pixel art:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
