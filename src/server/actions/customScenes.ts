"use server";

import fs from "fs";

export async function updateCustomSceneData({
  name,
  coordinates,
}: {
  name: string;
  coordinates: { [k: string]: string };
}) {
  const fileName = `./custom_scenes/${name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(coordinates, null, 2));
}
