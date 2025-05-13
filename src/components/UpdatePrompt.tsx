"use client";

import { updateNow } from "@/server/actions/app";
import { NextVersion } from "@/types";
import { Button, Code, Flex, Loader, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

interface SettingsProps {
  nextVersion: NextVersion | null;
}

export function UpdatePrompt({ nextVersion }: SettingsProps) {
  const [updatingModalOpened, updatingModalHandler] = useDisclosure(false);
  const [releaseNotesModalOpened, releaseNotesModalHandler] =
    useDisclosure(false);

  useEffect(() => {
    if (!updatingModalOpened) return;

    (async () => {
      const result = await updateNow();
      console.log("Update result", result);
      window.location.reload();
    })();
  }, [updatingModalOpened]);

  return (
    <>
      {nextVersion && (
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
          p={100}
        >
          <Loader size="xl" />
          <Text size="lg">Updating...</Text>
        </Flex>
      </Modal>
    </>
  );
}
