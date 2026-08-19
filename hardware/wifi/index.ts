import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// wifi-connect only runs while the setup portal/hotspot is active, so its
// presence is an unambiguous "we're in provisioning mode" signal. A plain IP
// check can't tell provisioning apart from a real connection, because the
// hotspot hands the device its own gateway address (e.g. 192.168.42.1).
export async function isProvisioning(): Promise<boolean> {
  try {
    await execAsync("pgrep -x wifi-connect");
    return true;
  } catch {
    // pgrep exits non-zero when no matching process is found.
    return false;
  }
}

// Delete every saved WiFi connection so the next boot has nothing to join and
// falls back into setup mode. Used by the long-press re-provision flow (e.g.
// the device moved to a new home / new network).
export async function forgetWifiNetworks(): Promise<void> {
  try {
    const { stdout } = await execAsync("nmcli -t -f UUID,TYPE connection show");
    const uuids = stdout
      .split("\n")
      .filter((line) => line.endsWith(":802-11-wireless"))
      .map((line) => line.split(":")[0])
      .filter(Boolean);

    for (const uuid of uuids) {
      console.log(`[HARDWARE] Forgetting WiFi connection ${uuid}`);
      await execAsync(`nmcli connection delete uuid ${uuid}`);
    }
  } catch (error) {
    console.error("[HARDWARE] Failed to forget WiFi networks:", error);
  }
}
