"use client";

import { Button, Stack } from "@mantine/core";
import { Preset } from "../types";
import { PresetItem } from "./PresetItem";
import Link from "next/link";

interface PresetsListProps {
  presets: Preset[];
  formattedEndTimes: string[];
}

export function PresetsList({ presets, formattedEndTimes }: PresetsListProps) {
  return (
    <>
      <Stack>
        {presets.map((preset, i) => (
          <PresetItem
            key={i}
            preset={preset}
            index={i}
            formattedEndTime={formattedEndTimes[i]}
          />
        ))}
      </Stack>
      <Button
        variant="light"
        fullWidth
        mt="lg"
        size="md"
        href="/presets/new"
        component={Link}
      >
        New Preset
      </Button>
    </>
  );
}
