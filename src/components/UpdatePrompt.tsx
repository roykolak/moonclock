"use client";

import { markAsUpdated, startUpdate } from "@/server/actions/app";
import { NextVersion } from "@/types";
import {
  Anchor,
  Button,
  Code,
  Flex,
  Loader,
  Modal,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";

interface UpdatePromptProps {
  nextVersion: NextVersion | null;
  releaseNotesOpen: boolean;
  onReleaseNotesOpenChange: (open: boolean) => void;
}

type Phase = "downloading" | "installing";

interface DownloadProgress {
  version: string;
  status: "downloading" | "complete" | "error";
  bytesDownloaded: number;
  totalBytes: number;
  message?: string;
}

function formatMB(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const UPDATE_POLL_INTERVAL_MS = 1000;
// Generous: a first-time install can spend minutes in apt, even though an update
// now finishes in about ten seconds.
const UPDATE_POLL_TIMEOUT_MS = 10 * 60_000;

export function UpdatePrompt({
  nextVersion,
  releaseNotesOpen,
  onReleaseNotesOpenChange,
}: UpdatePromptProps) {
  const [updatingModalOpened, updatingModalHandler] = useDisclosure(false);
  const [phase, setPhase] = useState<Phase>("downloading");
  const [downloadProgress, setDownloadProgress] =
    useState<DownloadProgress | null>(null);
  const [currentInstallStep, setCurrentInstallStep] = useState<string>("");
  const installStartedRef = useRef(false);

  useEffect(() => {
    if (!updatingModalOpened || !nextVersion) return;

    let cancelled = false;
    installStartedRef.current = false;

    // The version reported by /api/update-status is a complete account of where
    // the update is, because each release bundles its own package.json: the old
    // number means the install is still running, a failed request means the app
    // is between processes, and the expected number means the new release is
    // already the one answering — so it is also the only safe moment to reload,
    // since whichever process answers decides the version the page renders.
    //
    // Watching that one value is why there is a single loop here. Earlier
    // versions keyed off "Starting Moonclock" appearing in the install step,
    // which install.sh blanks a moment later; missing that narrow window left
    // the modal spinning forever. The step is now display only.
    const beginInstall = async () => {
      if (installStartedRef.current) return;
      installStartedRef.current = true;
      setPhase("installing");
      await startUpdate();

      const deadline = Date.now() + UPDATE_POLL_TIMEOUT_MS;

      const loop = setInterval(async () => {
        if (cancelled) return clearInterval(loop);

        const finish = async () => {
          clearInterval(loop);
          // Recorded before reloading so the modal does not reopen on the way
          // back in. Awaited rather than raced against the reload.
          await markAsUpdated().catch(() => {});
          if (!cancelled) window.location.reload();
        };

        // Reload on timeout too: if the update stalled, dropping back into the
        // app to see the real state beats a modal that spins forever.
        if (Date.now() > deadline) return finish();

        try {
          const response = await fetch("/api/update-status", {
            cache: "no-store",
          });
          const { version, step } = await response.json();
          setCurrentInstallStep(step ?? "");
          if (version === nextVersion.version) await finish();
        } catch {
          // Refused between the old process exiting and the new one binding
          // port 80 — expected mid-restart, so just wait for the next tick.
        }
      }, UPDATE_POLL_INTERVAL_MS);
    };

    const beginDownload = async () => {
      if (nextVersion?.downloadedAt) {
        beginInstall();
        return;
      }

      setPhase("downloading");
      await fetch(`/api/download-update`, { method: "POST" });

      const loop = setInterval(async () => {
        if (cancelled) return clearInterval(loop);
        const response = await fetch(`/api/current-download-progress`);
        const data: DownloadProgress | null = await response.json();
        setDownloadProgress(data);

        if (data?.status === "complete") {
          clearInterval(loop);
          beginInstall();
        } else if (data?.status === "error") {
          clearInterval(loop);
        }
      }, 500);
    };

    beginDownload();

    return () => {
      cancelled = true;
    };
  }, [updatingModalOpened, nextVersion?.downloadedAt]);

  useEffect(() => {
    if (nextVersion?.updateStartedAt && !nextVersion?.updateFinishedAt) {
      updatingModalHandler.open();
    }
  }, []);

  if (!nextVersion) return;

  const downloadPct =
    downloadProgress && downloadProgress.totalBytes > 0
      ? (downloadProgress.bytesDownloaded / downloadProgress.totalBytes) * 100
      : 0;

  return (
    <>
      {!nextVersion.updateStartedAt && (
        <Anchor
          component="button"
          type="button"
          size="sm"
          fw={500}
          onClick={() => onReleaseNotesOpenChange(true)}
          data-testid="update-available-link"
        >
          Update...
        </Anchor>
      )}

      <Modal
        title={`What's new in v${nextVersion?.version}`}
        opened={releaseNotesOpen}
        onClose={() => onReleaseNotesOpenChange(false)}
      >
        <Stack gap="xl">
          <Code style={{ whiteSpace: "pre-line" }}>
            {nextVersion?.releaseNotes}
          </Code>
          <Stack>
            <Button
              onClick={() => {
                onReleaseNotesOpenChange(false);
                updatingModalHandler.open();
              }}
            >
              Update Now!
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Modal
        opened={updatingModalOpened}
        onClose={updatingModalHandler.close}
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        <Flex
          justify="center"
          align="center"
          direction="column"
          gap="lg"
          p={10}
          mih={400}
        >
          {phase === "downloading" ? (
            <>
              <Text size="lg">Downloading v{nextVersion.version}</Text>
              {downloadProgress?.status === "error" ? (
                <Text size="sm" c="red">
                  {downloadProgress.message || "Download failed"}
                </Text>
              ) : (
                <>
                  <Progress
                    value={downloadPct}
                    w="100%"
                    animated={downloadProgress?.status !== "complete"}
                  />
                  <Text size="sm" c="dimmed">
                    {downloadProgress && downloadProgress.totalBytes > 0
                      ? `${formatMB(downloadProgress.bytesDownloaded)} / ${formatMB(downloadProgress.totalBytes)}`
                      : "Starting download..."}
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              <Loader size="xl" />
              <Text size="lg">Update in Progress</Text>
              <Text size="sm">{currentInstallStep}</Text>
            </>
          )}
        </Flex>
      </Modal>
    </>
  );
}
