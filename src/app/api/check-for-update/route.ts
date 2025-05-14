import { setData } from "@/server/db";
import packageInfo from "../../../../package.json";
import { log } from "console";

export async function PUT() {
  let message: string = "";

  log("Checking for update");

  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const latestRelease = releases[0];

    if (!latestRelease) {
      console.log("No releases found.");
      return;
    }

    const latestVersion = latestRelease.tag_name.replace("v", "");

    // Compare versions
    if (latestVersion !== packageInfo.version) {
      setData({
        nextVersion: {
          version: latestVersion,
          releaseNotes: latestRelease.body,
          updatedAt: null,
        },
      });
      message = "Update available - " + latestVersion;
    } else {
      message = "No update found";
    }
  } catch (e) {
    log(e);
    message = "Error checking for update";
  }

  log(message);

  return Response.json({ message });
}
