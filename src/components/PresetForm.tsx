"use client";

import {
  Accordion,
  Box,
  Button,
  Collapse,
  Flex,
  Group,
  Input,
  InputLabel,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Preset, PresetField, SceneName } from "../types";
import { useForm, UseFormReturnType } from "@mantine/form";
import { PresetPreview } from "./PresetPreview";
import { useDisclosure } from "@mantine/hooks";
import {
  MacroMarqueeConfig,
  MacroPromptConfig,
  MacroRippleConfig,
  MacroTextConfig,
  MacroTwinkleConfig,
} from "@/display-engine/types";
import { Scenes } from "./Scenes";
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
        name: "smile",
      } as Partial<MacroMarqueeConfig>);
    }

    if (value === SceneName.Color) {
      return form.setFieldValue(fieldValue, {
        color: "#ff0000",
      } as Partial<MacroMarqueeConfig>);
    }

    if (value === SceneName.Moon) {
      return form.setFieldValue(fieldValue, {
        animateStarTwinkle: true,
      } as Partial<MacroMarqueeConfig>);
    }

    if (value === SceneName.Message) {
      return form.setFieldValue(fieldValue, {
        text: "Hello\nWorld!",
      } as Partial<MacroTextConfig>);
    }

    if (value === SceneName.Prompt) {
      return form.setFieldValue(fieldValue, {
        prompt: "a happy cat",
        executedPrompt: "a happy cat",
      } as Partial<MacroPromptConfig>);
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
          <Scenes form={form} customSceneNames={customSceneNames} />
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
            <Stack gap={8}>
              <Group justify="space-between">
                <Text size="sm">Override Display Brightness</Text>
                <Switch
                  checked={!!form.getValues()[PresetField.Brightness]}
                  onChange={(event) => {
                    const { checked } = event.currentTarget;
                    form.setValues({
                      [PresetField.Brightness]: checked ? 25 : null,
                    });
                  }}
                />
              </Group>
              <Slider
                label={null}
                disabled={!form.getValues()[PresetField.Brightness]}
                key={form.key(PresetField.Brightness)}
                {...form.getInputProps(PresetField.Brightness)}
              />
            </Stack>

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
