"use client";

import { Button, Modal, Stack } from "@mantine/core";
import { Preset, Scene } from "../types";
import { PresetItem } from "./PresetItem";
import { useDisclosure } from "@mantine/hooks";
import { PresetForm } from "./PresetForm";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { setPresets } from "@/server/actions";

interface PresetsListProps {
  presets: Preset[];
  scenes: Scene[];
  formattedEndTimes: string[];
}

export function PresetsList({
  presets,
  scenes,
  formattedEndTimes,
}: PresetsListProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [presetModalOpen, presetModalHandlers] = useDisclosure();

  return (
    <>
      <Modal
        title="Custom Preset"
        opened={presetModalOpen}
        onClose={() => {
          presetModalHandlers.close();
          setSelectedPresetId(null);
        }}
      >
        <PresetForm
          presets={presets}
          scenes={scenes}
          id={selectedPresetId}
          onDelete={() => {
            if (selectedPresetId === null) return;

            const newPresets = [...presets];
            newPresets.splice(selectedPresetId, 1);
            setPresets(newPresets);

            showNotification({ message: "Removed preset!" });

            setSelectedPresetId(null);
            presetModalHandlers.close();
          }}
          onSubmit={(values) => {
            const newPresets = [...presets];

            if (selectedPresetId !== null) {
              newPresets[selectedPresetId] = values;
              showNotification({ message: "Successfully updated preset!" });
            } else {
              newPresets.push(values);
              showNotification({ message: "Successfully created preset!" });
            }

            setPresets(newPresets);

            setSelectedPresetId(null);
            presetModalHandlers.close();
          }}
        />
      </Modal>
      <Stack>
        {presets.map((preset, i) => (
          <PresetItem
            key={i}
            preset={preset}
            index={i}
            formattedEndTime={formattedEndTimes[i]}
            scene={
              scenes.find(({ name }) => name === preset.sceneName) as Scene
            }
            onClick={(index) => {
              setSelectedPresetId(index);
              presetModalHandlers.open();
            }}
          />
        ))}
      </Stack>
      <Button
        variant="light"
        fullWidth
        mt="lg"
        size="md"
        onClick={presetModalHandlers.open}
      >
        New Preset
      </Button>
    </>
  );
}
