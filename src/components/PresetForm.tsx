"use client";

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
import { Preset, Scene } from "../types";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import Display from "./Display";

interface PresetFormProps {
  opened: boolean;
  showName?: boolean;
  onClose: () => void;
  onSubmit: (values: Preset) => void;
  scenes: Scene[];
  preset: Preset | null;
}

export function PresetForm({
  opened,
  onClose,
  scenes,
  preset,
  onSubmit,
  showName = true,
}: PresetFormProps) {
  const form = useForm<Preset>({
    initialValues: {
      mode: "forever",
      name: "",
      sceneName: scenes[0].name,
      end: {
        hour: 0,
        day: 0,
        minute: 0,
      },
    },
  });

  useEffect(() => {
    if (preset) form.setValues(preset);
  }, [JSON.stringify(preset)]);

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
          <Display
            scene={scenes.find((s) => s.name === form.values.sceneName)}
          />
          <SegmentedControl
            fullWidth
            data={["forever", "offset", "until"]}
            key={form.key("mode")}
            {...form.getInputProps("mode")}
          />

          {form.values.mode !== "forever" && (
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
