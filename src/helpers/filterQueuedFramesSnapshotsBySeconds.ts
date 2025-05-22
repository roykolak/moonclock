import { QueuedFramesSnapshot } from "@/types";

export function filterQueuedFramesSnapshotsBySeconds(
  queuedFramesSnapshots: QueuedFramesSnapshot[],
  lookbackInSeconds: number = 5
) {
  const latestTimestamp = new Date(
    queuedFramesSnapshots?.[queuedFramesSnapshots?.length - 1]?.timestamp
  );

  const secondsAgo = new Date(latestTimestamp);
  secondsAgo.setSeconds(latestTimestamp.getSeconds() - lookbackInSeconds);

  return queuedFramesSnapshots.filter((s) => {
    return s.timestamp > secondsAgo.getTime();
  });
}
