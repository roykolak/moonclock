"use client";

import { Button, Stack } from "@mantine/core";
import { Preset, Scene } from "../types";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { setPresets } from "../server/actions";
import { PresetForm } from "./PresetForm";
import { PresetItem } from "./PresetItem";

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
        {presets.map((preset, i) => (
          <PresetItem
            key={i}
            preset={preset}
            index={i}
            scene={
              scenes.find(({ name }) => name === preset.sceneName) as Scene
            }
            handleDelete={(i) => {
              const newPresets = [...presets];
              newPresets.splice(i, 1);
              setPresets(newPresets);
            }}
            handleEdit={(i) => {
              setSelectedPresetIndex(i);
              editHandlers.open();
            }}
          />
        ))}
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
