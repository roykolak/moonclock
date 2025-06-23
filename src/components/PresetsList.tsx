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
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  return (
    <>
      <Title order={2} mb="md">
        Presets
      </Title>
      <Modal
        opened={presetModalOpen}
        title={selectedPreset !== null ? "Edit Preset" : "Create New Preset"}
        onClose={presetModalHandlers.close}
      >
        <PresetForm
          customSceneNames={customSceneNames}
          preset={selectedPreset || null}
          action={async (preset) => {
            if (selectedPreset) {
              updatePreset(preset);
            } else {
              createPreset(preset);
            }
            presetModalHandlers.close();
          }}
          submitLabel={selectedPreset ? "Update Preset" : "Create Preset"}
        />
        {selectedPreset && (
          <Button
            color="red"
            variant="outline"
            type="submit"
            fullWidth
            mt="xl"
            onClick={() => {
              if (!selectedPreset.id) return;
              presetModalHandlers.close();
              deletePreset(selectedPreset.id);
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
              setSelectedPreset(preset);
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
          setSelectedPreset(null);
          presetModalHandlers.open();
        }}
      >
        New Preset
      </Button>
    </>
  );
}
