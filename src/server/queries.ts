"use server";

import fs from "fs";
import { customScenesPath } from "./utils";

export async function getCustomSceneNames() {
  return fs.readdirSync(customScenesPath()).map((file) => file.split(".")[0]);
}

export async function getCustomScenes() {
  return fs.readdirSync(customScenesPath()).map((file) => {
    const name = file.split(".")[0];
    const coordinates = JSON.parse(
      fs.readFileSync(`${customScenesPath()}/${name}.json`).toString()
    );
    return { name, coordinates };
  });
}
