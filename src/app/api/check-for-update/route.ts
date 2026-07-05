import { getData, setData } from "@/server/db";
import packageInfo from "../../../../package.json";
import { releaseDownloadPath } from "@/server/utils";
import { selectEligibleRelease } from "@/helpers/selectEligibleRelease";

export async function PUT() {
  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const { panel, nextVersion } = getData();
    const channel = panel?.updateChannel ?? "stable";

    const eligible = selectEligibleRelease(
      releases,
      channel,
      packageInfo.version,
    );

    if (!eligible) {
      if (nextVersion) setData({ nextVersion: null });
      return Response.json({ message: "Up to date.", available: false });
    }

    setData({
      nextVersion: {
        version: eligible.version,
        releaseNotes: eligible.release.body,
        downloadUrl: eligible.asset.browser_download_url,
        absoluteFilePath: releaseDownloadPath(),
        downloadedAt: null,
        updateFinishedAt: null,
        updateStartedAt: null,
      },
    });

    return Response.json({
      message: `Update available - ${eligible.version}`,
      available: true,
      version: eligible.version,
    });
  } catch (e) {
    console.log(e);
    return Response.json({
      message: "Error checking for update",
      available: false,
    });
  }
}
