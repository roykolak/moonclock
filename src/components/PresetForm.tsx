"use client";

import {
  Box,
  Button,
  Flex,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Preset, PresetField, Scene } from "../types";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import Display from "./Display";
import { IconTrash } from "@tabler/icons-react";

interface PresetFormProps {
  id?: number | null;
  scenes: Scene[];
  presets: Preset[];
  showName?: boolean;
  onSubmit: (value: Preset) => void;
  onDelete?: () => void;
}

export function PresetForm({
  scenes,
  presets,
  id,
  showName = true,
  onSubmit,
  onDelete,
}: PresetFormProps) {
  const form = useForm<Preset>({
    initialValues: {
      mode: "for",
      name: "",
      sceneName: scenes[0].name,
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:00",
    },
  });

  useEffect(() => {
    if (editting) form.setValues(presets[id]);
  }, [id]);

  const editting = id !== null && id !== undefined;

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmit(values))}
      data-testid="preset-form"
    >
      <Stack>
        {showName && (
          <TextInput
            placeholder=""
            variant="filled"
            style={{ flex: 1 }}
            label="Name"
            required
            data-testid="preset-name"
            key={form.key(PresetField.Name)}
            {...form.getInputProps(PresetField.Name)}
          />
        )}

        <Group>
          <Select
            placeholder="Scene"
            variant="filled"
            style={{ flex: 1 }}
            label="Scene name"
            data={scenes?.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            data-testid="scene-select"
            required
            key={form.key(PresetField.SceneName)}
            {...form.getInputProps(PresetField.SceneName)}
          />
          <Box w="36" mt={24}>
            <Display
              scene={scenes.find((s) => s.name === form.values.sceneName)}
            />
          </Box>
        </Group>
        <SegmentedControl
          fullWidth
          data={["for", "until"]}
          key={form.key("mode")}
          {...form.getInputProps("mode")}
        />
        {form.values.mode === "for" && (
          <>
            <Text>Show for...</Text>
            <Select
              data={[
                { label: "Forever", value: "0:00" },
                { label: "5 minutes", value: "0:05" },
                { label: "15 minutes", value: "0:15" },
                { label: "30 minutes", value: "0:30" },
                { label: "1 hour", value: "1:00" },
                { label: "1 hour 30 minutes", value: "1:30" },
                { label: "2 hours", value: "2:00" },
              ]}
              data-testid="for-time-select"
              key={form.key(PresetField.ForTime)}
              {...form.getInputProps(PresetField.ForTime)}
            />
          </>
        )}
        {form.values.mode === "until" && (
          <>
            <Text>Show until tomorrow at...</Text>
            <Flex gap="xs">
              <Select
                placeholder="Hour"
                data={[
                  { label: "5 AM", value: "5" },
                  { label: "6 AM", value: "6" },
                  { label: "7 AM", value: "7" },
                  { label: "8 AM", value: "8" },
                  { label: "9 AM", value: "9" },
                  { label: "10 AM", value: "10" },
                  { label: "11 AM", value: "11" },
                  { label: "12 PM", value: "12" },
                  { label: "1 PM", value: "13" },
                ]}
                data-testid="until-hour-select"
                key={form.key(PresetField.UntilHour)}
                {...form.getInputProps(PresetField.UntilHour)}
              />
              <Text>:</Text>
              <Select
                placeholder="Minute"
                data={[
                  { label: "00", value: "00" },
                  { label: "15", value: "15" },
                  { label: "30", value: "30" },
                  { label: "45", value: "45" },
                ]}
                data-testid="until-minute-select"
                key={form.key(PresetField.UntilMinute)}
                {...form.getInputProps(PresetField.UntilMinute)}
              />
            </Flex>
          </>
        )}

        <Flex gap="sm" mt="lg">
          {editting && (
            <Button
              color="red"
              variant="light"
              onClick={onDelete}
              title="Delete preset"
            >
              <IconTrash size="20" />
            </Button>
          )}
          <Button type="submit" fullWidth>
            Save
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
