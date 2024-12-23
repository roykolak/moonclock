"use client";

import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  SegmentedControl,
  Select,
  Stack,
  Text,
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
      mode: "for",
      name: "",
      sceneName: scenes[0].name,
      untilMinute: "0",
      untilDay: "0git",
      untilHour: "0",
      forTime: "0:0",
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
              required
              key={form.key("sceneName")}
              {...form.getInputProps("sceneName")}
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
                  { label: "Forever", value: "0:0" },
                  { label: "5 minutes", value: "0:5" },
                  { label: "15 minutes", value: "0:15" },
                  { label: "30 minutes", value: "0:30" },
                  { label: "1 hour", value: "1:0" },
                  { label: "1 hour 30 minutes", value: "1:30" },
                  { label: "2 hours", value: "2:0" },
                ]}
                key={form.key("forTime")}
                {...form.getInputProps("forTime")}
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
                  key={form.key("endHour")}
                  {...form.getInputProps("endHour")}
                />
                <Text>:</Text>
                <Select
                  placeholder="Minute"
                  data={[
                    { label: "0", value: "0" },
                    { label: "15", value: "15" },
                    { label: "30", value: "30" },
                    { label: "45", value: "45" },
                  ]}
                  key={form.key("endMinute")}
                  {...form.getInputProps("endMinute")}
                />
              </Flex>
            </>
          )}

          <Button type="submit" mt="lg">
            Save
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
