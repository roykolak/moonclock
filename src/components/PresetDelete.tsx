"use client";

import { Button } from "@mantine/core";
import { deletePreset } from "@/server/actions";

interface PresetFormProps {
  index: number;
}

export function PresetDelete({ index }: PresetFormProps) {
  const deletePresetWithIndex = deletePreset.bind(null, index);

  return (
    <form action={deletePresetWithIndex} data-testid="preset-delete-form">
      <Button color="red" variant="outline" type="submit" fullWidth mt="xl">
        Delete Preset
      </Button>
    </form>
  );
}
