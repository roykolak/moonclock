"use client";

import { Box, Button, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { Preset, Scene } from "../types";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Display from "./Display";
import { setPresets } from "../server/actions";
import { IconTrash } from "@tabler/icons-react";
import { PresetForm } from "./PresetForm";
import { getEndDate } from "@/utils";

interface PresetsListProps {
  presets: Preset[];
  scenes: Scene[];
}

export function PresetsList({ presets, scenes }: PresetsListProps) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(
    null
  );
  const [editOpened, editHandlers] = useDisclosure();

  return (
    <>
      <PresetForm
        opened={editOpened}
        preset={
          selectedPresetIndex === null ? null : presets[selectedPresetIndex]
        }
        scenes={scenes}
        onSubmit={(values) => {
          const newPresets = [...presets];

          if (selectedPresetIndex === null) {
            newPresets.push(values);
          } else {
            newPresets[selectedPresetIndex as number] = values;
          }
          setPresets(newPresets);
        }}
        onClose={() => {
          editHandlers.close();
          setSelectedPresetIndex(null);
        }}
      />
      <Stack>
        {presets.map((preset, i) => {
          const scene = scenes.find(({ name }) => name === preset.sceneName);

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
                      <FriendlyEndTime preset={preset} />
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap="xs">
                  <Button
                    size="compact-xs"
                    color="red"
                    variant="transparent"
                    onClick={() => {
                      const newPresets = [...presets];
                      newPresets.splice(i, 1);
                      setPresets(newPresets);
                    }}
                  >
                    <IconTrash size="20" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setSelectedPresetIndex(i);
                      editHandlers.open();
                    }}
                  >
                    Edit
                  </Button>
                </Flex>
              </Group>
            </Card>
          );
        })}
      </Stack>
      <Button
        variant="light"
        fullWidth
        mt="lg"
        size="md"
        onClick={() => {
          setSelectedPresetIndex(null);
          editHandlers.open();
        }}
      >
        New Preset
      </Button>
    </>
  );
}

function FriendlyEndTime({ preset }: { preset: Preset }) {
  const endDate = getEndDate(preset);

  if (preset.mode === "until") {
    return `Until ${endDate?.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (preset.mode === "offset") {
    return `For ${preset.end.hour} hours`;
  }

  if (preset.mode === "forever") {
    return `Forever`;
  }
}
