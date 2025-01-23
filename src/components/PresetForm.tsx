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
  Title,
} from "@mantine/core";
import { CustomScene, Preset, PresetField, SceneName } from "../types";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { PresetPreview } from "./PresetPreview";
import { useActionState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { deletePreset } from "@/server/actions";

interface PresetFormProps {
  index: number | null;
  preset?: Preset;
  customScenes: CustomScene[];
  title: string;
  action: (previousState: any, formData: FormData) => Promise<string>;
}

const defaultPreset: Preset = {
  mode: "for",
  name: "",
  scenes: [{ sceneName: SceneName.Moon }],
  untilMinute: "0",
  untilDay: "0",
  untilHour: "0",
  forTime: "0:05",
};

export function PresetForm({
  index,
  preset = defaultPreset,
  customScenes,
  action,
  title,
}: PresetFormProps) {
  const router = useRouter();

  const [message, formAction] = useActionState(action, null);

  useEffect(() => {
    if (!message) return;
    router.back();
  }, [message]);

  const form = useForm<Preset>({
    initialValues: { ...defaultPreset, ...preset },
  });

  return (
    <form action={formAction} data-testid="preset-form">
      <Title order={2}>{title}</Title>
      <Box w="50%" m="auto" mb="md">
        <PresetPreview preset={form.values} />
      </Box>
      <Stack>
        <TextInput
          placeholder=""
          variant="filled"
          style={{ flex: 1 }}
          label="Name"
          required
          data-testid="preset-name"
          key={form.key(PresetField.Name)}
          name={PresetField.Name}
          {...form.getInputProps(PresetField.Name)}
        />

        <Group>
          <Select
            placeholder="Scene"
            variant="filled"
            style={{ flex: 1 }}
            label="Scene name"
            data={[
              {
                group: "Built-in Scenes",
                items: [SceneName.Moon, SceneName.Countdown, SceneName.Twinkle],
              },
              {
                group: "Custom Scenes",
                items: customScenes?.map((scene) => scene.name),
              },
            ]}
            data-testid="scene-select"
            required
            key={form.key(`${PresetField.Scenes}.0.sceneName`)}
            name={`${PresetField.Scenes}.0.sceneName`}
            {...form.getInputProps(`${PresetField.Scenes}.0.sceneName`)}
          />
        </Group>
        <SegmentedControl
          fullWidth
          data={["for", "until"]}
          key={form.key("mode")}
          name={PresetField.Mode}
          {...form.getInputProps("mode")}
        />
        {form.values.mode === "for" && (
          <>
            <Text>Show for...</Text>
            <Select
              data={[
                { label: "5 minutes", value: "0:05" },
                { label: "15 minutes", value: "0:15" },
                { label: "30 minutes", value: "0:30" },
                { label: "1 hour", value: "1:00" },
                { label: "1 hour 30 minutes", value: "1:30" },
                { label: "2 hours", value: "2:00" },
                { label: "Forever", value: "0:00" },
              ]}
              data-testid="for-time-select"
              key={form.key(PresetField.ForTime)}
              name={PresetField.ForTime}
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
                name={PresetField.UntilHour}
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
                name={PresetField.UntilMinute}
                {...form.getInputProps(PresetField.UntilMinute)}
              />
            </Flex>
          </>
        )}

        <Flex gap="sm" mt="lg">
          {index !== null && (
            <Button
              color="red"
              variant="light"
              onClick={() => {
                deletePreset(index);
                redirect("/presets");
              }}
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
