"use client";

import { markAsUpdated, updateNow } from "@/server/actions/app";
import { NextVersion } from "@/types";
import {
  Button,
  Code,
  Flex,
  Loader,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import packageInfo from "../../package.json";
import { IconCircleCheckFilled } from "@tabler/icons-react";

interface SettingsProps {
  nextVersion: NextVersion | null;
}

export function UpdatePrompt({ nextVersion }: SettingsProps) {
  const [updatingModalOpened, updatingModalHandler] = useDisclosure(false);
  const [releaseNotesModalOpened, releaseNotesModalHandler] =
    useDisclosure(false);
  const [updatedModalOpened, updatedModalHandler] = useDisclosure(false);

  useEffect(() => {
    if (!updatingModalOpened) return;

    (async () => {
      const result = await updateNow();
      console.log("Update result", result);

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    })();
  }, [updatingModalOpened]);

  useEffect(() => {
    if (
      nextVersion?.version === packageInfo.version &&
      !nextVersion.updatedAt
    ) {
      updatedModalHandler.open();
    }
  }, []);

  if (!nextVersion) return;

  return (
    <>
      {!nextVersion.updatedAt && (
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
        title="You're up to date!"
        opened={updatedModalOpened}
        onClose={updatedModalHandler.close}
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        <Flex justify="center" align="center" direction="column" gap="lg">
          <ThemeIcon variant="transparent" size={200}>
            <IconCircleCheckFilled size={200} />
          </ThemeIcon>
        </Flex>
        <Stack gap="xl">
          <Code style={{ whiteSpace: "pre-line" }}>
            {nextVersion?.releaseNotes}
          </Code>
          <Stack>
            <Button
              onClick={() => {
                markAsUpdated();
                updatedModalHandler.close();
              }}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </Modal>

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
