"use client";

import {
  Accordion,
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
import { Preset } from "../types";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ScenePicker } from "./ScenePicker";
import { SceneId } from "@/scenes/types";
import { getFriendlyEndTime } from "@/helpers/getFriendlyEndTime";

interface PresetFormProps {
  preset: Preset | null;
  title?: string;
  submitLabel?: string;
  action: (preset: Preset) => void;
}

const defaultPreset: Preset = {
  mode: "for",
  name: "",
  sceneId: SceneId.Moon,
  untilMinute: "0",
  untilDay: "0",
  untilHour: "0",
  forTime: "0:05",
};

export function PresetForm({
  preset = defaultPreset,
  action,
  submitLabel,
  title,
}: PresetFormProps) {
  const form = useForm<Preset>({
    initialValues: { ...defaultPreset, ...preset },
  });

  const [expirationOpened, { toggle: expirationToggle }] = useDisclosure(false);

  return (
    <form onSubmit={form.onSubmit(action)} data-testid="preset-form">
      {title && <Title order={2}>{title}</Title>}
      <Stack>
        <TextInput
          placeholder=""
          variant="filled"
          style={{ flex: 1 }}
          label="Name"
          required
          data-testid="preset-name"
          key={form.key("name")}
          {...form.getInputProps("name")}
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

        <Collapse expanded={expirationOpened}>
          <ExpirationTime form={form} />
        </Collapse>

        <Stack gap="2">
          <InputLabel>Scene</InputLabel>
          <ScenePicker form={form} />
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
          key={form.key("forTime")}
          {...form.getInputProps("forTime")}
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
            key={form.key("untilDay")}
            {...form.getInputProps("untilDay")}
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
            key={form.key("untilHour")}
            {...form.getInputProps("untilHour")}
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
            key={form.key("untilMinute")}
            {...form.getInputProps("untilMinute")}
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
    <Accordion variant="filled">
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
                  checked={!!form.getValues().brightness}
                  onChange={(event) => {
                    const { checked } = event.currentTarget;
                    form.setValues({
                      brightness: checked ? 25 : null,
                    });
                  }}
                />
              </Group>
              <Slider
                label={null}
                disabled={!form.getValues().brightness}
                key={form.key("brightness")}
                {...form.getInputProps("brightness")}
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
              key={form.key("timeAdjustmentAmount")}
              {...form.getInputProps("timeAdjustmentAmount")}
            />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
