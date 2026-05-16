import { getData, setData } from "@/server/db";
import packageInfo from "../../../../package.json";
import { releaseDownloadPath } from "@/server/utils";

export async function PUT() {
  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const latestRelease = releases[0];

    if (!latestRelease) {
      return Response.json({ message: "No release found.", available: false });
    }

    const asset = latestRelease.assets[0];

    if (!asset) {
      return Response.json({ message: "No asset found.", available: false });
    }

    const latestVersion = latestRelease.tag_name.replace("v", "");

    if (latestVersion === packageInfo.version) {
      const { nextVersion } = getData();
      if (nextVersion) setData({ nextVersion: null });
      return Response.json({ message: "Up to date.", available: false });
    }

    setData({
      nextVersion: {
        version: latestVersion,
        releaseNotes: latestRelease.body,
        downloadUrl: asset.browser_download_url,
        absoluteFilePath: releaseDownloadPath(),
        downloadedAt: null,
        updateFinishedAt: null,
        updateStartedAt: null,
      },
    });

    return Response.json({
      message: `Update available - ${latestVersion}`,
      available: true,
      version: latestVersion,
    });
  } catch (e) {
    console.log(e);
    return Response.json({
      message: "Error checking for update",
      available: false,
    });
  }
}
