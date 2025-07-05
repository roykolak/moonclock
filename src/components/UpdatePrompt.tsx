"use client";

import { markAsUpdated, startUpdate } from "@/server/actions/app";
import { NextVersion } from "@/types";
import { Button, Code, Flex, Loader, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

interface SettingsProps {
  nextVersion: NextVersion | null;
}

export function UpdatePrompt({ nextVersion }: SettingsProps) {
  const [updatingModalOpened, updatingModalHandler] = useDisclosure(false);
  const [releaseNotesModalOpened, releaseNotesModalHandler] =
    useDisclosure(false);
  const [currentInstallStep, setCurrentInstallStep] = useState();

  useEffect(() => {
    if (!updatingModalOpened) return;

    (async () => {
      await startUpdate();

      const loop = setInterval(async () => {
        const response = await fetch(`/api/current-install-step`);
        const data = await response.json();
        setCurrentInstallStep(data.step);

        if (data.step.includes("Starting")) {
          markAsUpdated();
          clearInterval(loop);
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        }
      }, 1000);
    })();
  }, [updatingModalOpened]);

  useEffect(() => {
    if (nextVersion?.updateStartedAt && !nextVersion?.updateFinishedAt) {
      updatingModalHandler.open();
    }
  }, []);

  if (!nextVersion) return;

  return (
    <>
      {!nextVersion.updateStartedAt && (
        <Button
          size="xs"
          variant="outline"
          onClick={async () => {
            releaseNotesModalHandler.open();
          }}
        >
          Update...
        </Button>
      )}

      <Modal
        title={`What's new in v${nextVersion?.version}`}
        opened={releaseNotesModalOpened}
        onClose={releaseNotesModalHandler.close}
      >
        <Stack gap="xl">
          <Code style={{ whiteSpace: "pre-line" }}>
            {nextVersion?.releaseNotes}
          </Code>
          <Stack>
            <Button
              onClick={async () => {
                releaseNotesModalHandler.close();
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
          <Loader size="xl" />
          <Text size="lg">Update in Progress</Text>
          <Text size="sm">{currentInstallStep}</Text>
        </Flex>
      </Modal>
    </>
  );
}
