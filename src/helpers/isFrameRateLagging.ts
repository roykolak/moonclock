import { HardwareState } from "@/types";

export function isFrameRateLagging(hardwareState: HardwareState | null) {
  if (!hardwareState) return false;

  const { queuedFramesSnapshots } = hardwareState;

  let highestQueuedFrameSnapshot = 0;

  if (queuedFramesSnapshots) {
    highestQueuedFrameSnapshot = Math.max(
      ...queuedFramesSnapshots.map(({ count }) => count)
    );
  }

  return highestQueuedFrameSnapshot > 4;
}
