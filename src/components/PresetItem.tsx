"use client";

import { Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { Preset, PresetField } from "../types";
import { Macro } from "../../shared/display-engine";
import { SlotPreview } from "./SlotPreview";

interface PresetItemProps {
  preset: Preset;
  formattedEndTime: string;
  displayConfig: Macro[];
  index: number;
  onClick: (index: number) => void;
}

export function PresetItem({
  index,
  preset,
  formattedEndTime,
  displayConfig,
  onClick,
}: PresetItemProps) {
  return (
    <Card key={preset.name} padding="xs" data-testid="preset-item">
      <Group justify="space-between">
        <Flex align="center" gap="sm">
          <Box w="46">
            <SlotPreview
              scene={preset[PresetField.SceneName]}
              displayConfig={displayConfig}
            />
          </Box>
          <Box>
            <Text fw="bold">{preset.name}</Text>
            <Text size="sm" c="dimmed">
              {formattedEndTime}
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="xs">
          <Button size="sm" variant="light" onClick={() => onClick(index)}>
            Edit
          </Button>
        </Flex>
      </Group>
    </Card>
  );
}
