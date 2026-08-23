"use client";

import { DeviceApi, DownloadProgress } from "@/client/deviceApi";
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
  api: DeviceApi;
  onFinished: () => void;
  releaseNotesOpen: boolean;
  onReleaseNotesOpenChange: (open: boolean) => void;
}

type Phase = "downloading" | "installing";

function formatMB(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const UPDATE_POLL_INTERVAL_MS = 1000;
const UPDATE_POLL_TIMEOUT_MS = 10 * 60_000;

export function UpdatePrompt({
  nextVersion,
  api,
  onFinished,
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

    const beginInstall = async () => {
      if (installStartedRef.current) return;
      installStartedRef.current = true;
      setPhase("installing");
      await api.startUpdate();

      const deadline = Date.now() + UPDATE_POLL_TIMEOUT_MS;

      const loop = setInterval(async () => {
        if (cancelled) return clearInterval(loop);

        const finish = async () => {
          clearInterval(loop);
          await api.completeUpdate().catch(() => {});
          if (!cancelled) onFinished();
        };

        if (Date.now() > deadline) return finish();

        try {
          const { version, step } = await api.getUpdateStatus();
          setCurrentInstallStep(step ?? "");
          if (version === nextVersion.version) await finish();
        } catch {}
      }, UPDATE_POLL_INTERVAL_MS);
    };

    const beginDownload = async () => {
      if (nextVersion?.downloadedAt) {
        beginInstall();
        return;
      }

      setPhase("downloading");
      await api.startDownload();

      const loop = setInterval(async () => {
        if (cancelled) return clearInterval(loop);
        const data = await api.getDownloadProgress();
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
