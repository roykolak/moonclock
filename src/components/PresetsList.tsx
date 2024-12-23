"use client";

import { Button, Stack } from "@mantine/core";
import { Preset, Scene } from "../types";
import { PresetItem } from "./PresetItem";
import Link from "next/link";

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
  return (
    <>
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
          />
        ))}
      </Stack>
      <Button
        variant="light"
        fullWidth
        mt="lg"
        size="md"
        component={Link}
        href={`/presets/new`}
      >
        New Preset
      </Button>
    </>
  );
}
