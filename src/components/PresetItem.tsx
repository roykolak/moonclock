"use client";

import { Box, Button, Card, Flex, Group, Text } from "@mantine/core";
import { Preset, Scene } from "../types";
import Display from "./Display";
import Link from "next/link";

interface PresetItemProps {
  preset: Preset;
  formattedEndTime: string;
  scene: Scene;
  index: number;
}

export function PresetItem({
  index,
  preset,
  formattedEndTime,
  scene,
}: PresetItemProps) {
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
              {formattedEndTime}
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="xs">
          <Button
            size="sm"
            variant="light"
            component={Link}
            href={`/presets/${index}/edit`}
          >
            Edit
          </Button>
        </Flex>
      </Group>
    </Card>
  );
}
