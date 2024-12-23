"use client";

import { Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { Preset, Scene } from "../types";
import { useEffect, useState } from "react";
import Display from "./Display";
import { IconTrash } from "@tabler/icons-react";
import { getEndDate } from "@/utils";

interface PresetItemProps {
  preset: Preset;
  scene: Scene;
  index: number;
  handleDelete: (i: number) => void;
  handleEdit: (i: number) => void;
}

export function PresetItem({
  preset,
  index,
  scene,
  handleDelete,
  handleEdit,
}: PresetItemProps) {
  const [friendlyEndTime, setFriendlyEndTime] = useState<string>();

  useEffect(() => {
    setFriendlyEndTime(getFriendlyEndTime(preset));
  }, [JSON.stringify(preset)]);

  return (
    <Card key={preset.name} padding="xs">
      <Group justify="space-between">
        <Flex align="center" gap="sm">
          <Box w="46">
            <Display scene={scene} />
          </Box>
          <Box>
            <Text fw="bold">{preset.name}</Text>
            <Text size="sm" c="dimmed">
              {friendlyEndTime}
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="xs">
          <Button
            size="compact-xs"
            color="red"
            variant="transparent"
            onClick={() => handleDelete(index)}
          >
            <IconTrash size="20" />
          </Button>
          <Button size="sm" variant="light" onClick={() => handleEdit(index)}>
            Edit
          </Button>
        </Flex>
      </Group>
    </Card>
  );
}

function getFriendlyEndTime(preset: Preset) {
  const { mode } = preset;

  if (mode === "until") {
    const endDate = getEndDate(preset);
    return `Until ${endDate?.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })} tomorrow`;
  }

  if (mode === "for") {
    const [hour, minute] = preset.forTime.split(":");
    if (hour === "0" && minute === "0") {
      return "Forever";
    }
    if (hour === "0") {
      return `For ${minute} minutes`;
    } else {
      if (minute === "0") {
        return `For ${hour} hours`;
      } else {
        return `For ${hour} hours & ${minute} mins`;
      }
    }
  }
}
