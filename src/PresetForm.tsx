"use client";

import "@mantine/core/styles.css";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { Preset, SceneData } from "./types";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export function PresetForm({
  opened,
  onClose,
  scenes,
  preset,
  onSubmit,
  showName = true,
}: {
  opened: boolean;
  showName?: boolean;
  onClose: () => void;
  onSubmit: (values: Preset) => void;
  scenes: SceneData[];
  preset: Preset | null;
}) {
  const form = useForm<Partial<Preset>>({
    mode: "uncontrolled",
    initialValues: {
      mode: "forever",
      name: "",
      end: {
        hour: 0,
        day: 0,
        minute: 0,
      },
    },
  });

  const [showModeInputs, setShowModeInputs] = useState(false);

  useEffect(() => {
    const presetValues = preset || { mode: "forever" };
    form.setValues(presetValues);
    setShowModeInputs(presetValues?.mode !== "forever");
  }, [preset?.name, opened]);

  form.watch("mode", ({ value }) => {
    setShowModeInputs(value !== "forever");
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={preset ? "Edit Preset" : "New Preset"}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values as Preset);
          form.reset();
          onClose();
        })}
      >
        <Stack>
          {showName && (
            <TextInput
              placeholder=""
              variant="filled"
              style={{ flex: 1 }}
              label="Name"
              required
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          )}
          <Select
            placeholder="Scene"
            variant="filled"
            style={{ flex: 1 }}
            label="Scene name"
            data={scenes?.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            required
            key={form.key("scene")}
            {...form.getInputProps("scene")}
          />
          <SegmentedControl
            fullWidth
            data={["forever", "offset", "until"]}
            key={form.key("mode")}
            {...form.getInputProps("mode")}
          />

          {showModeInputs && (
            <Group>
              <NumberInput
                placeholder=""
                variant="filled"
                style={{ flex: 1 }}
                label="Day"
                required
                key={form.key("end.day")}
                {...form.getInputProps("end.day")}
              />
              <NumberInput
                variant="filled"
                style={{ flex: 1 }}
                label="Hour"
                required
                key={form.key("end.hour")}
                {...form.getInputProps("end.hour")}
              />
              <NumberInput
                variant="filled"
                style={{ flex: 1 }}
                label="Minute"
                required
                key={form.key("end.minute")}
                {...form.getInputProps("end.minute")}
              />
            </Group>
          )}
          <Button type="submit" mt="lg">
            Save
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
