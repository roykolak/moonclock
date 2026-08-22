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

// How long to keep asking /api/version who is answering before reloading anyway.
const VERSION_POLL_INTERVAL_MS = 500;
const VERSION_POLL_TIMEOUT_MS = 90_000;

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

    // The process that answers a reload decides which version the page renders,
    // and the outgoing app keeps serving until it has drained — measured between
    // 0s and 7s across updates. Waiting a fixed delay here used to guess at that
    // and lose: the page reloaded against the old process and showed the
    // previous version until you refreshed again. Poll for the incoming release
    // instead, and reload only once it is the one answering.
    const reloadWhenNewVersionIsServing = async (expected: string) => {
      const deadline = Date.now() + VERSION_POLL_TIMEOUT_MS;

      while (!cancelled && Date.now() < deadline) {
        try {
          const response = await fetch("/api/version", { cache: "no-store" });
          const { version } = await response.json();
          if (version === expected) break;
        } catch {
          // Connection refused between the old process exiting and the new one
          // binding port 80 — expected mid-restart, so keep waiting.
        }

        await new Promise((resolve) =>
          setTimeout(resolve, VERSION_POLL_INTERVAL_MS),
        );
      }

      // Reload on timeout too: if the update stalled, dropping back into the app
      // to see the real state beats a modal that spins forever.
      if (!cancelled) window.location.reload();
    };

    const beginInstall = async () => {
      if (installStartedRef.current) return;
      installStartedRef.current = true;
      setPhase("installing");
      await startUpdate();

      const loop = setInterval(async () => {
        if (cancelled) return clearInterval(loop);
        const response = await fetch(`/api/current-install-step`);
        const data = await response.json();
        setCurrentInstallStep(data.step);

        if (data.step.includes("Starting")) {
          markAsUpdated();
          clearInterval(loop);
          reloadWhenNewVersionIsServing(nextVersion.version);
        }
      }, 1000);
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
