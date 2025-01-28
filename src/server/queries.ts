"use server";

import fs from "fs";

export async function getLastHeartbeat() {
  try {
    return fs.readFileSync(`./hardware/lastHeartbeat.txt`).toString();
  } catch {
    return null;
  }
}

export async function getCustomSceneNames() {
  return fs.readdirSync("./custom_scenes").map((file) => file.split(".")[0]);
}

export async function getCustomScenes() {
  return fs.readdirSync("./custom_scenes").map((file) => {
    const name = file.split(".")[0];
    const coordinates = JSON.parse(
      fs.readFileSync(`./custom_scenes/${name}.json`).toString()
    );
    return { name, coordinates };
  });
}
