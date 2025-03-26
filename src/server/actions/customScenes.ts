"use server";

import fs from "fs";
import { customScenesPath } from "../utils";

export async function updateCustomSceneData({
  name,
  coordinates,
}: {
  name: string;
  coordinates: { [k: string]: string };
}) {
  const fileName = `${customScenesPath()}/${name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(coordinates, null, 2));
}
