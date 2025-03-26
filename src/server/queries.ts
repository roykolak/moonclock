"use server";

import fs from "fs";
import { customScenesPath } from "./utils";

export async function getLastHeartbeat() {
  try {
    return fs.readFileSync(`./hardware/lastHeartbeat.txt`).toString();
  } catch {
    return null;
  }
}

export async function getCustomSceneNames() {
  customScenesPath();
  return fs.readdirSync(customScenesPath()).map((file) => file.split(".")[0]);
}

export async function getCustomScenes() {
  customScenesPath();
  return fs.readdirSync(customScenesPath()).map((file) => {
    const name = file.split(".")[0];
    const coordinates = JSON.parse(
      fs.readFileSync(`${customScenesPath()}/${name}.json`).toString()
    );
    return { name, coordinates };
  });
}
