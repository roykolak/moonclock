"use server";

import fs from "fs";
import { customScenesPath, reloadHardware } from "../utils";
import { getData } from "../db";
import { SceneName } from "@/types";

export async function updateCustomSceneData({
  name,
  coordinates,
}: {
  name: string;
  coordinates: { [k: string]: string };
}) {
  const { scheduledPreset } = getData();
  const fileName = `${customScenesPath()}/${name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(coordinates, null, 2));

  const isCustomSceneActive = scheduledPreset?.preset?.scenes.some(
    ({ sceneName }) => sceneName === name
  );

  if (isCustomSceneActive) {
    console.log(`[HARDWARE] ${SceneName} is active, reloading hardware`);
    reloadHardware();
  }
}
