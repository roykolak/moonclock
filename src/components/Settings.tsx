"use client";

import { updatePanel } from "@/server/actions/panel";
import { Panel } from "@/types";
import {
  Accordion,
  Button,
  Divider,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

interface SettingsProps {
  panel: Panel;
}

export function Settings({ panel }: SettingsProps) {
  const form = useForm<Panel>({
    initialValues: {
      ...panel,
      updateChannel: panel.updateChannel ?? "stable",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updatePanel(values);
        showNotification({ message: "Successfully updated settings!" });
      })}
      data-testid="preset-form"
    >
      <Title order={2} mb="md">
        Panel Settings
      </Title>
      <Stack>
        <TextInput
          placeholder=""
          variant="filled"
          style={{ flex: 1 }}
          label="Name"
          required
          data-testid="panel-name-input"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <Select
          placeholder="Time increment"
          variant="filled"
          style={{ flex: 1 }}
          label="Time increment"
          description="Adjust +/- controls for time amounts"
          data={[
            { label: "1 minute", value: "1" },
            { label: "5 minutes", value: "5" },
            { label: "10 minutes", value: "10" },
            { label: "20 minutes", value: "20" },
            { label: "30 minutes", value: "30" },
            { label: "1 hour", value: "60" },
          ]}
          data-testid="time-adjustment-select"
          required
          key={form.key("timeAdjustmentAmount")}
          {...form.getInputProps("timeAdjustmentAmount")}
        />
        <Divider />

        <Title order={5} mt="md">
          Updates
        </Title>

        <Select
          variant="filled"
          style={{ flex: 1 }}
          label="Release channel"
          description="Beta receives prerelease builds; switching back to Stable keeps the current version until a newer stable release ships"
          data={[
            { label: "Stable", value: "stable" },
            { label: "Beta", value: "beta" },
          ]}
          allowDeselect={false}
          data-testid="update-channel-select"
          key={form.key("updateChannel")}
          {...form.getInputProps("updateChannel")}
        />

        <Divider />

        <Title order={5} mt="md">
          Hardware Settings
        </Title>

        <Stack gap={4}>
          <Text size="sm">Display Brightness</Text>
          <Slider
            label={null}
            key={form.key("brightness")}
            {...form.getInputProps("brightness")}
          />
        </Stack>

        <Accordion variant="separated" mt="md">
          <Accordion.Item key="hardware" value="advanced">
            <Accordion.Control>
              <Text size="sm" c="dimmed">
                Advanced Settings
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="lg">
                <Stack gap={4}>
                  <Stack gap={0}>
                    <Text size="sm">LED PWN LSB nanoseconds</Text>
                    <Text c="dimmed" size="xs">
                      Higher values will provide better image quality (more
                      accurate color, less ghosting) at the expense of frame
                      rate.
                    </Text>
                  </Stack>
                  <Slider
                    max={1000}
                    key={form.key("pwnLsbNanoseconds")}
                    {...form.getInputProps("pwnLsbNanoseconds")}
                  />
                </Stack>

                <Stack gap={4}>
                  <Stack gap={0}>
                    <Text size="sm">GPIO Slowdown</Text>
                    <Text c="dimmed" size="xs">
                      If you have a Raspberry Pi with a slower processor (Model
                      A, A+, B+, Zero), then a value of 0 (zero) might work and
                      is desirable. A Raspberry Pi 3 or Pi4 might even need
                      higher values for the panels to be.
                    </Text>
                  </Stack>
                  <Slider
                    max={4}
                    min={0}
                    key={form.key("gpioSlowdown")}
                    {...form.getInputProps("gpioSlowdown")}
                  />
                </Stack>

                <Stack gap={4}>
                  <Stack gap={4}>
                    <Text size="sm">PWN Bits</Text>
                    <Text c="dimmed" size="xs">
                      Lower values will increase performance at the expense of
                      color precision.
                    </Text>
                  </Stack>
                  <Slider
                    max={11}
                    min={1}
                    key={form.key("pwmBits")}
                    {...form.getInputProps("pwmBits")}
                  />
                </Stack>

                <Select
                  label="Hardware Mapping"
                  description="GPIO wiring layout for your LED matrix HAT or adapter"
                  variant="filled"
                  data={[
                    { label: "Regular", value: "regular" },
                    { label: "Adafruit HAT", value: "adafruit-hat" },
                    { label: "Adafruit HAT (PWM)", value: "adafruit-hat-pwm" },
                    { label: "Regular (Pi 1)", value: "regular-pi1" },
                  ]}
                  key={form.key("hardwareMapping")}
                  {...form.getInputProps("hardwareMapping")}
                />

                <Stack gap={4}>
                  <Switch
                    label="Enable Button"
                    description="Enable GPIO button to cycle through presets"
                    key={form.key("buttonEnabled")}
                    {...form.getInputProps("buttonEnabled", {
                      type: "checkbox",
                    })}
                  />
                </Stack>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Button type="submit" fullWidth mt="md">
          Save
        </Button>
      </Stack>
    </form>
  );
}
