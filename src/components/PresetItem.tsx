"use client";

import { Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { Preset } from "../types";
import { PresetPreview } from "./PresetPreview";
import Link from "next/link";

interface PresetItemProps {
  preset: Preset;
  formattedEndTime: string;
  index: number;
}

export function PresetItem({
  index,
  preset,
  formattedEndTime,
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
          <Button
            size="sm"
            variant="light"
            href={`/presets/${index}/edit`}
            component={Link}
          >
            Edit
          </Button>
        </Flex>
      </Group>
    </Card>
  );
}
