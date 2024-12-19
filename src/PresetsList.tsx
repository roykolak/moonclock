"use client";

import "@mantine/core/styles.css";
import { Box, Button, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { Preset, SceneData } from "./types";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Display from "./Display";
import { coordinates } from "@bigdots-io/display-engine";
import { setPresets } from "./server/actions";
import { IconTrash } from "@tabler/icons-react";
import { PresetForm } from "./PresetForm";

export function getEndDate(preset: Preset) {
  if (preset.mode === "forever") {
    return null;
  }

  const endDate = new Date();

  if (preset.mode === "until") {
    endDate.setDate(endDate.getDate() + preset.end.day);
    endDate.setHours(preset.end.hour, preset.end.minute, 0, 0);
  } else if (preset.mode === "offset") {
    endDate.setHours(endDate.getHours() + preset.end.hour);
    endDate.setMinutes(endDate.getMinutes() + preset.end.minute);
  }

  return endDate;
}

export function PresetsList({
  presets,
  scenes,
}: {
  presets: Preset[];
  scenes: SceneData[];
}) {
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
          const endDate = getEndDate(preset);
          return (
            <Card key={preset.name} padding="xs">
              <Group justify="space-between">
                <Flex align="center" gap="sm">
                  <Box w="46">
                    <Display
                      layers={[
                        coordinates({
                          coordinates: scenes.find(
                            ({ name }) => name === preset.scene
                          )?.coordinates,
                        }),
                      ]}
                      dimensions={{ height: 32, width: 32 }}
                    />
                  </Box>
                  <Box>
                    <Text fw="bold">{preset.name}</Text>
                    <Text size="sm" c="dimmed">
                      {preset.mode === "until" &&
                        `Until ${endDate?.toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}`}
                      {preset.mode === "offset" &&
                        `For ${preset.end.hour} hours`}
                      {preset.mode === "forever" && `Forever`}
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
