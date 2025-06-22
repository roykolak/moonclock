"use client";

import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  ColorInput,
  Flex,
  Group,
  Input,
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
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  MacroMarqueeConfig,
  MacroRippleConfig,
  MacroTwinkleConfig,
} from "@/display-engine/types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getFriendlyEndTime } from "@/helpers/getFriendlyEndTime";

interface PresetFormProps {
  preset: Preset | null;
  customSceneNames: string[];
  title?: string;
  submitLabel?: string;
  action: (preset: Preset) => void;
}

const defaultPreset: Preset = {
  mode: "for",
  name: "",
  scenes: [],
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
  const form = useForm<Preset>({
    initialValues: { ...defaultPreset, ...preset },
  });

  const [expirationOpened, { toggle: expirationToggle }] = useDisclosure(false);

  form.watch("scenes.0.sceneName", ({ value }) => {
    const fieldValue = "scenes.0.sceneConfig";

    if (value === SceneName.Twinkle) {
      return form.setFieldValue(fieldValue, {
        color: "#ffffff",
        speed: 30,
        amount: 50,
      } as Partial<MacroTwinkleConfig>);
    }

    if (value === SceneName.Ripple) {
      return form.setFieldValue(fieldValue, {
        color: "#ffffff",
        speed: 30,
        waveHeight: 6,
      } as Partial<MacroRippleConfig>);
    }

    if (value === SceneName.Marquee) {
      return form.setFieldValue(fieldValue, {
        color: "#ffffff",
        speed: 30,
        fontSize: 16,
        text: "hello",
      } as Partial<MacroMarqueeConfig>);
    }

    if (value === SceneName.Emoji) {
      return form.setFieldValue(fieldValue, {
        emoji: "😁",
      } as Partial<MacroMarqueeConfig>);
    }

    if (value === SceneName.Color) {
      return form.setFieldValue(fieldValue, {
        color: "#ff0000",
      } as Partial<MacroMarqueeConfig>);
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
          {...form.getInputProps(PresetField.Name)}
        />

        <Stack gap={2}>
          <InputLabel required>Expiration Time</InputLabel>
          {!expirationOpened && (
            <Input
              placeholder=""
              variant="filled"
              style={{ flex: 1 }}
              required
              readOnly
              rightSectionPointerEvents="all"
              value={getFriendlyEndTime(form.getValues())}
              rightSectionWidth={55}
              rightSection={
                <Button
                  onClick={expirationToggle}
                  variant="outline"
                  size="compact-sm"
                  data-testid="change-expiration"
                >
                  Edit
                </Button>
              }
            />
          )}
        </Stack>

        <Collapse in={expirationOpened}>
          <ExpirationTime form={form} />
        </Collapse>

        <Stack gap="2">
          <InputLabel>Scene</InputLabel>
          {form.getValues().scenes.map((item, index) => (
            <Scene
              key={index}
              form={form}
              index={index}
              customSceneNames={customSceneNames}
            />
          ))}
          <Button
            variant="light"
            data-testid="new-scene-button"
            onClick={() =>
              form.insertListItem("scenes", {
                sceneName: SceneName.Moon,
                sceneConfig: {},
              })
            }
          >
            Add new scene
          </Button>
        </Stack>
        <AdvancedSettings form={form} />
        <Flex mt="xs">
          <Button type="submit" fullWidth>
            {submitLabel || "Save"}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

function Scene({
  form,
  index,
  customSceneNames,
}: {
  form: UseFormReturnType<Preset>;
  index: number;
  customSceneNames: string[];
}) {
  const [sceneControlsVisible, sceneControlshandlers] = useDisclosure();

  return (
    <Group key={index} w="100%" mb="xs">
      <Group w="100%" gap="6">
        <Select
          placeholder="Scene"
          variant="filled"
          style={{ flex: "auto" }}
          data={[
            {
              group: "Built-in Scenes",
              items: [
                SceneName.Moon,
                SceneName.Color,
                SceneName.Countdown,
                SceneName.Twinkle,
                SceneName.Ripple,
                SceneName.Marquee,
                SceneName.Emoji,
              ],
            },
            {
              group: "Custom Scenes",
              items: customSceneNames,
            },
          ]}
          data-testid={`scene-${index}-select`}
          required
          key={form.key(`scenes.${index}.sceneName`)}
          {...form.getInputProps(`scenes.${index}.sceneName`)}
        />
        <ActionIcon
          variant="light"
          data-testid={`scene-${index}-settings-button`}
          onClick={sceneControlshandlers.toggle}
          size="lg"
        >
          <IconSettings size={22} />
        </ActionIcon>
        <ActionIcon
          color="red"
          variant="light"
          size="lg"
          data-testid={`scene-${index}-delete-button`}
          onClick={() => form.removeListItem("scenes", index)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      {sceneControlsVisible && (
        <SceneConfigControls form={form} index={index} />
      )}
    </Group>
  );
}

export function SceneConfigControls({
  form,
  index,
}: {
  form: UseFormReturnType<Preset>;
  index: number;
}) {
  const { sceneName } = form.getValues().scenes[index];

  if (sceneName === "emoji") {
    return (
      <Picker
        data={data}
        previewPosition="none"
        navPosition="none"
        maxFrequentRows="1"
        onEmojiSelect={(emoji: any) => {
          form.setFieldValue(`scenes.${index}.sceneConfig.emoji`, emoji.native);
        }}
      />
    );
  }

  if (sceneName === "twinkle") {
    return (
      <Card w="100%">
        <Stack>
          <Stack gap={4}>
            <Text size="sm">Twinkle Speed</Text>
            <Slider
              label={null}
              min={5}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.speed`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Twinkle Amount</Text>
            <Slider
              label={null}
              key={form.key(`scenes.${index}.sceneConfig.amount`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.amount`)}
            />
          </Stack>
          <ColorInput
            placeholder="Select a twinkle color"
            key={form.key(`scenes.${index}.sceneConfig.color`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.color`)}
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === SceneName.Color) {
    return (
      <Card w="100%">
        <Stack>
          <ColorInput
            placeholder="Select a color"
            key={form.key(`scenes.${index}.sceneConfig.color`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.color`)}
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
              label={null}
              min={5}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.speed`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Wave height</Text>
            <Slider
              label={null}
              key={form.key(`scenes.${index}.sceneConfig.waveHeight`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.waveHeight`)}
            />
          </Stack>
          <ColorInput
            placeholder="Select a twinkle color"
            key={form.key(`scenes.${index}.sceneConfig.color`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.color`)}
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === "marquee") {
    return (
      <Card w="100%">
        <Stack>
          <TextInput
            label="Message"
            key={form.key(`scenes.${index}.sceneConfig.text`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.text`)}
          />
          <Stack gap={4}>
            <Text size="sm">Font size</Text>
            <Slider
              min={12}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.fontSize`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.fontSize`)}
            />
          </Stack>
          <Checkbox
            label="Mirror horizontally"
            key={form.key(`scenes.${index}.sceneConfig.mirrorHorizontally`)}
            {...form.getInputProps(
              `scenes.${index}.sceneConfig.mirrorHorizontally`
            )}
          />
          <Stack gap={4}>
            <Text size="sm">Speed</Text>
            <Slider
              min={5}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.speed`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Starting row</Text>
            <Slider
              max={32}
              key={form.key(`scenes.${index}.sceneConfig.startingRow`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.startingRow`)}
            />
          </Stack>
          <ColorInput
            placeholder="Select a twinkle color"
            key={form.key(`scenes.${index}.sceneConfig.color`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.color`)}
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

export function ExpirationTime({ form }: { form: UseFormReturnType<Preset> }) {
  return (
    <Stack>
      <SegmentedControl
        fullWidth
        data={[
          { label: "For...", value: "for" },
          { label: "Until...", value: "until" },
        ]}
        key={form.key("mode")}
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
      )}
    </Stack>
  );
}

export function AdvancedSettings({
  form,
}: {
  form: UseFormReturnType<Preset>;
}) {
  return (
    <Accordion defaultValue="Apples" variant="filled">
      <Accordion.Item key="hardware" value="hardware">
        <Accordion.Control>
          <Text size="sm" c="dimmed">
            Advanced Settings
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Select
              label="Time adjustment interval"
              description="Configure a custom time adjustment interval in the UI"
              placeholder="Select..."
              data={[
                { label: "1 minute", value: "1" },
                { label: "5 minutes", value: "5" },
                { label: "10 minutes", value: "10" },
                { label: "20 minutes", value: "20" },
                { label: "30 minutes", value: "30" },
                { label: "1 hour", value: "60" },
              ]}
              data-testid="time-adjustment-select"
              key={form.key(PresetField.TimeAdjustmentAmount)}
              {...form.getInputProps(PresetField.TimeAdjustmentAmount)}
            />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
