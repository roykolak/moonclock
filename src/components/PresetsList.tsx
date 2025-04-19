"use client";

import { Button, Modal, Stack, Title } from "@mantine/core";
import { Preset } from "../types";
import { PresetItem } from "./PresetItem";
import { PresetForm } from "./PresetForm";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  createPreset,
  deletePreset,
  updatePreset,
} from "@/server/actions/presets";

interface PresetsListProps {
  presets: Preset[];
  formattedEndTimes: string[];
  customSceneNames: string[];
}

export function PresetsList({
  presets,
  formattedEndTimes,
  customSceneNames,
}: PresetsListProps) {
  const [presetModalOpen, presetModalHandlers] = useDisclosure();
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(-1);

  return (
    <>
      <Title order={2} mb="md">
        Presets
      </Title>
      <Modal
        opened={presetModalOpen}
        title={selectedPresetIndex >= 0 ? "Edit Preset" : "Create New Preset"}
        onClose={presetModalHandlers.close}
      >
        <PresetForm
          customSceneNames={customSceneNames}
          preset={presets[selectedPresetIndex]}
          action={async (preset) => {
            if (selectedPresetIndex >= 0) {
              updatePreset(selectedPresetIndex, preset);
            } else {
              createPreset(preset);
            }
            presetModalHandlers.close();
          }}
          submitLabel={
            selectedPresetIndex >= 0 ? "Update Preset" : "Create Preset"
          }
        />
        {selectedPresetIndex >= 0 && (
          <Button
            color="red"
            variant="outline"
            type="submit"
            fullWidth
            mt="xl"
            onClick={() => {
              presetModalHandlers.close();
              deletePreset(selectedPresetIndex);
            }}
          >
            Delete Preset
          </Button>
        )}
      </Modal>
      <Stack>
        {presets.map((preset, i) => (
          <PresetItem
            key={i}
            preset={preset}
            formattedEndTime={formattedEndTimes[i]}
            onEditClick={() => {
              setSelectedPresetIndex(i);
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
        onClick={() => {
          setSelectedPresetIndex(-1);
          presetModalHandlers.open();
        }}
      >
        New Preset
      </Button>
    </>
  );
}
