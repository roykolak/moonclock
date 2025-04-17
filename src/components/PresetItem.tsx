"use client";

import { Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { Preset } from "../types";
import { PresetPreview } from "./PresetPreview";

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
          <Button size="sm" variant="light" onClick={onEditClick}>
            Edit
          </Button>
        </Flex>
      </Group>
    </Card>
  );
}
