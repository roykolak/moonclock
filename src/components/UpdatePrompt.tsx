"use client";

import { updateNow } from "@/server/actions/app";
import { NextVersion } from "@/types";
import {
  Button,
  Card,
  Code,
  Flex,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface SettingsProps {
  nextVersion: NextVersion | null;
}

export function UpdatePrompt({ nextVersion }: SettingsProps) {
  const [updating, setUpdating] = useState(false);
  const [updateModalopened, updateModalHandler] = useDisclosure(false);

  const theme = useMantineTheme();

  return (
    <>
      {nextVersion && (
        <Card bg={theme.colors.teal[9]} p="sm" mb="md">
          <Flex direction="row" gap="sm" align="center">
            <Text flex="1" size="sm" fw={500} c="white">
              Update available!
            </Text>
            <Button
              size="xs"
              color="white"
              variant="outline"
              onClick={async () => {
                updateModalHandler.open();
              }}
            >
              Update...
            </Button>
          </Flex>
        </Card>
      )}
      <Modal
        opened={updateModalopened}
        onClose={updateModalHandler.close}
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        {updating ? (
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
        ) : (
          <Stack gap="xl">
            <Title order={3}>New in {nextVersion?.version}...</Title>
            <Code style={{ whiteSpace: "pre-line" }}>
              {nextVersion?.releaseNotes}
            </Code>
            <Stack>
              <Button
                onClick={async () => {
                  setUpdating(true);
                  const result = await updateNow();
                  console.log(result);
                  window.location.reload();
                }}
              >
                Update Now!
              </Button>
              <Button variant="outline" onClick={updateModalHandler.close}>
                Not now
              </Button>
            </Stack>
          </Stack>
        )}
      </Modal>
    </>
  );
}
