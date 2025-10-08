"use client";

import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Text,
} from "@mantine/core";
import { Preset, PresetField } from "../types";
import { PresetPreview } from "./PresetPreview";
import { IconPin, IconPinFilled } from "@tabler/icons-react";
import { updatePreset } from "@/server/actions/presets";

interface PresetItemProps {
  preset: Preset;
  formattedEndTime: string;
  onEditClick: () => void;
}

export function PresetItem({
  preset,
  formattedEndTime,
  onEditClick,
}: PresetItemProps) {
  return (
    <Card key={preset.name} padding="xs" data-testid="preset-item">
      <Group justify="space-between">
        <Flex align="center" gap="sm">
          <Box w="46">
            <PresetPreview preset={preset} />
          </Box>
          <Box>
            <Text fw="bold">{preset.name}</Text>
            <Text size="sm" c="dimmed">
              {formattedEndTime}
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="xs">
          <ActionIcon
            variant="transparent"
            data-testid="pin-toggle"
            onClick={() => {
              updatePreset({
                ...preset,
                pinned: !(preset[PresetField.Pinned] || false),
              });
            }}
          >
            {preset[PresetField.Pinned] ? <IconPinFilled /> : <IconPin />}
          </ActionIcon>
          <Button size="sm" variant="light" onClick={onEditClick}>
            Edit
          </Button>
        </Flex>
      </Group>
    </Card>
  );
}
