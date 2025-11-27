import Anthropic from "@anthropic-ai/sdk";
import { getData } from "../db";
import { getCachedPrompt, setCachedPrompt } from "./promptCache";
import vm from "vm";

export async function generatePixelArt(description: string) {
  // Check cache first
  const cachedCoordinates = await getCachedPrompt(description);
  if (cachedCoordinates) {
    return { success: true, coordinates: cachedCoordinates };
  }

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
  const prompt = `You are a pixel art generator for a 32x32 LED matrix display. 
  
You are the world's greatest pixel art generator and you do an incredible job simplifying real world objects into a small grid of colors. 
Generate pixel art based on the user's description.

User description: "${description}"

Write Node.js code that creates pixel art. The code should:
1. Create a 32x32 grid (array of arrays)
2. Use null for empty pixels
3. Use hex color strings for colored pixels
4. Output JSON with "x:y" coordinate keys

Style: 8-bit aesthetic, vibrant but rich colors (not neon), high saturation
Keep designs SIMPLE and recognizable at 32x32 resolution

Example code structure:
\`\`\`javascript
// Create 32x32 grid
const grid = Array(32).fill(null).map(() => Array(32).fill(null));

// Draw your pixel art (example: red square)
for (let x = 10; x < 20; x++) {
    for (let y = 10; y < 20; y++) {
        grid[y][x] = "#FF0000";
    }
}

// Convert to coordinate format
const result = {};
for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
        if (grid[y][x] !== null) {
            result[\`\${x}:\${y}\`] = grid[y][x];
        }
    }
}

console.log(JSON.stringify(result));
\`\`\`

Write similar code for: ${description}
Return ONLY the JavaScript code, no markdown formatting or explanations.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
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

    // Remove markdown code blocks if present
    const code = textContent.text
      .replace(/```javascript\n?/g, "")
      .replace(/```\n?/g, "");

    // Capture console.log output
    let output = "";
    const mockConsole = {
      log: (msg: string) => {
        output = msg;
      },
    };

    // Execute code safely using Node's built-in vm module
    const context = vm.createContext({ mockConsole });
    const script = new vm.Script(
      code.replace(/console\.log/g, "mockConsole.log")
    );
    script.runInContext(context, { timeout: 1000 });

    const coordinates = JSON.parse(output);

    // Cache the result for future use
    await setCachedPrompt(description, coordinates);

    return { success: true, coordinates };
  } catch (error) {
    console.error("Error generating pixel art:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
