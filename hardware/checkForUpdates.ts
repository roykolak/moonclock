import { getData, set } from "@/server/db";
import { Coordinates, Slot } from "@/types";
import fs from "fs";

const resetCoordinates: Coordinates = {};

for (let x = 0; x < 32; x++) {
  for (let y = 0; y < 32; y++) {
    resetCoordinates[`${x}:${y}`] = "#000000";
  }
}

async function getSceneCoordinates(name: string) {
  const file = fs.readFileSync(`./scenes/${name}.json`).toString();
  return JSON.parse(file) as Coordinates;
}

export function setCurrentSlot(slot: Slot | null) {
  currentSlot = slot;
}

let currentSlot: Slot | null = null;

export async function checkForUpdates(): Promise<Coordinates[]> {
  try {
    fs.writeFileSync("./hardware/lastHeartbeat.txt", new Date().toJSON());

    const { slot } = await getData();

    if (!slot) return [];

    if (
      slot?.endTime !== null &&
      new Date().getTime() > new Date(slot.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${slot.sceneName} has expired`);
      await set("slot", null);

      return [resetCoordinates];
    }

    const activeSceneName = slot?.sceneName || "nothing";
    const currentSceneName = currentSlot?.sceneName || "nothing";

    const activeCoordinates = await getSceneCoordinates(activeSceneName);
    const currentCoordinates = await getSceneCoordinates(currentSceneName);

    if (
      JSON.stringify(currentCoordinates) !== JSON.stringify(activeCoordinates)
    ) {
      console.log(
        `[UPDATE] Rerendering ${activeSceneName} until ${slot?.endTime}`
      );

      setCurrentSlot(slot);

      return [resetCoordinates, activeCoordinates];
    } else if (currentSlot?.endTime !== slot?.endTime) {
      console.log(
        `[UPDATE] ${activeSceneName} endTime changed to ${slot.endTime}`
      );
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return [];
}
