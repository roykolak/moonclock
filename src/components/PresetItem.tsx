"use client";

import { Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { Preset, PresetField } from "../types";
import { SlotPreview } from "./SlotPreview";
import { transformSlotToDisplayConfig } from "@/helpers/transformSlotToDisplayConfig";

interface PresetItemProps {
  preset: Preset;
  formattedEndTime: string;
  index: number;
  onClick: (index: number) => void;
}

export function PresetItem({
  index,
  preset,
  formattedEndTime,
  onClick,
}: PresetItemProps) {
  const displayConfig = transformSlotToDisplayConfig(preset);
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
