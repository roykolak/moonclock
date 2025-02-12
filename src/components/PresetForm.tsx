"use client";

import {
  ActionIcon,
  Box,
  Button,
  Card,
  ColorInput,
  Divider,
  Flex,
  Group,
  InputLabel,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Preset, PresetField, SceneName } from "../types";
import { useForm, UseFormReturnType } from "@mantine/form";
import { PresetPreview } from "./PresetPreview";
import { IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { MacroRippleConfig, MacroTwinkleConfig } from "@/display-engine/types";

interface PresetFormProps {
  preset?: Preset;
  customSceneNames: string[];
  title?: string;
  submitLabel?: string;
  action: (preset: Preset) => void;
}

const defaultPreset: Preset = {
  mode: "for",
  name: "",
  scene: { layers: [{ sceneName: SceneName.Moon, sceneConfig: {} }] },
  untilMinute: "0",
  untilDay: "0",
  untilHour: "0",
  forTime: "0:05",
};

export function PresetForm({
  preset = defaultPreset,
  customSceneNames,
  action,
  submitLabel,
  title,
}: PresetFormProps) {
  const [sceneControlsVisible, sceneControlshandlers] = useDisclosure();

  const form = useForm<Preset>({
    initialValues: { ...defaultPreset, ...preset },
  });

  form.watch("scene.layers.0.sceneName", ({ value }) => {
    const fieldValue = "scene.layers.0.sceneConfig";

    if (value === SceneName.Twinkle) {
      return form.setFieldValue(fieldValue, {
        color: "#ffffff",
        speed: 50,
      } as Partial<MacroTwinkleConfig>);
    }

    if (value === SceneName.Ripple) {
      return form.setFieldValue(fieldValue, {
        color: "#ffffff",
        speed: 5,
        waveHeight: 6,
      } as Partial<MacroRippleConfig>);
    }

    form.setFieldValue(fieldValue, {});
  });

  return (
    <form onSubmit={form.onSubmit(action)} data-testid="preset-form">
      {title && <Title order={2}>{title}</Title>}
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

        <Stack gap="2">
          <InputLabel>Scene</InputLabel>
          {form.getValues().scene.layers.map((item, index) => (
            <Group key={index} w="100%">
              <Group w="100%">
                <Select
                  placeholder="Scene"
                  variant="filled"
                  style={{ flex: "auto" }}
                  data={[
                    {
                      group: "Built-in Scenes",
                      items: [
                        SceneName.Moon,
                        SceneName.Countdown,
                        SceneName.Twinkle,
                        SceneName.Ripple,
                      ],
                    },
                    {
                      group: "Custom Scenes",
                      items: customSceneNames,
                    },
                  ]}
                  data-testid="scene-select"
                  required
                  key={form.key(`scene.layers.${index}.sceneName`)}
                  name={`scene.layers.0.sceneName`}
                  {...form.getInputProps(`scene.layers.${index}.sceneName`)}
                />
                <ActionIcon
                  variant="light"
                  onClick={sceneControlshandlers.toggle}
                  size="lg"
                >
                  <IconSettings size={22} />
                </ActionIcon>
              </Group>
              {sceneControlsVisible && (
                <SceneConfigControls form={form} index={index} />
              )}
            </Group>
          ))}
        </Stack>
        <Divider />
        <SegmentedControl
          fullWidth
          data={[
            { label: "For...", value: "for" },
            { label: "Until...", value: "until" },
          ]}
          key={form.key("mode")}
          name={PresetField.Mode}
          {...form.getInputProps("mode")}
        />
        {form.values.mode === "for" && (
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
        )}
        {form.values.mode === "until" && (
          <Flex gap="xs">
            <Select
              placeholder="Hour"
              data={[
                { label: "Today", value: "0" },
                { label: "Tomorrow", value: "1" },
              ]}
              data-testid="until-hour-select"
              key={form.key(PresetField.UntilDay)}
              name={PresetField.UntilDay}
              {...form.getInputProps(PresetField.UntilDay)}
            />
            <Text>@</Text>
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
        )}

        <Flex mt="lg">
          <Button type="submit" fullWidth>
            {submitLabel || "Save"}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

export function SceneConfigControls({
  form,
  index,
}: {
  form: UseFormReturnType<Preset>;
  index: number;
}) {
  const { sceneName } = form.getValues().scene.layers[0];

  if (sceneName === "twinkle") {
    return (
      <Card w="100%">
        <Stack>
          <Stack gap={4}>
            <Text size="sm">Twinkle Speed</Text>
            <Slider
              key={form.key(`scene.layers.${index}.sceneConfig.speed`)}
              name={`scene.layers.${index}.sceneConfig.speed`}
              {...form.getInputProps(`scene.layers.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <ColorInput
            placeholder="Select a twinkle color"
            key={form.key(`scene.layers.${index}.sceneConfig.color`)}
            name={`scene.layers.${index}.sceneConfig.color`}
            {...form.getInputProps(`scene.layers.${index}.sceneConfig.color`)}
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === "ripple") {
    return (
      <Card w="100%">
        <Stack>
          <Stack gap={4}>
            <Text size="sm">Speed</Text>
            <Slider
              key={form.key(`scene.layers.${index}.sceneConfig.speed`)}
              name={`scene.layers.${index}.sceneConfig.speed`}
              {...form.getInputProps(`scene.layers.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Wave height</Text>
            <Slider
              key={form.key(`scene.layers.${index}.sceneConfig.waveHeight`)}
              name={`scene.layers.${index}.sceneConfig.waveHeight`}
              {...form.getInputProps(
                `scene.layers.${index}.sceneConfig.waveHeight`
              )}
            />
          </Stack>
          <ColorInput
            placeholder="Select a twinkle color"
            key={form.key(`scene.layers.${index}.sceneConfig.color`)}
            name={`scene.layers.${index}.sceneConfig.color`}
            {...form.getInputProps(`scene.layers.${index}.sceneConfig.color`)}
          />
        </Stack>
      </Card>
    );
  }

  return (
    <Card w="100%">
      <Text ta="center" size="xs">
        No scene options available
      </Text>
    </Card>
  );
}
