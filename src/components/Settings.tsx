"use client";

import { updatePanel } from "@/server/actions/panel";
import { Panel, PanelField, SceneName } from "@/types";
import {
  Accordion,
  Button,
  Divider,
  Group,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

interface SettingsProps {
  panel: Panel;
  customSceneNames: string[];
}

export function Settings({ panel, customSceneNames }: SettingsProps) {
  const form = useForm<Panel>({
    initialValues: {
      ...panel,
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
          key={form.key(PanelField.Name)}
          {...form.getInputProps(PanelField.Name)}
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
          key={form.key(PanelField.TimeAdjustmentAmount)}
          {...form.getInputProps(PanelField.TimeAdjustmentAmount)}
        />
        {form.getValues().defaultPreset.scenes.map((item, index) => (
          <Group key={index} w="100%">
            <Select
              placeholder="Scene"
              variant="filled"
              style={{ flex: 1 }}
              label="Default Scene"
              description="What will be shown when nothing is active"
              data={[
                {
                  group: "Built-in Scenes",
                  items: [SceneName.Blank, SceneName.Moon, SceneName.Twinkle],
                },
                {
                  group: "Custom Scenes",
                  items: customSceneNames,
                },
              ]}
              data-testid="default-scene-select"
              required
              key={form.key(`defaultPreset.scenes.${index}.sceneName`)}
              {...form.getInputProps(`defaultPreset.scenes.${index}.sceneName`)}
            />
          </Group>
        ))}
        <Divider />

        <Title order={5} mt="md">
          AI Settings
        </Title>

        <TextInput
          placeholder="sk-ant-..."
          variant="filled"
          style={{ flex: 1 }}
          label="Anthropic API Key"
          description="Required for AI pixel art generation"
          type="password"
          data-testid="anthropic-api-key-input"
          key={form.key(PanelField.AnthropicApiKey)}
          {...form.getInputProps(PanelField.AnthropicApiKey)}
        />

        <Divider />

        <Title order={5} mt="md">
          Hardware Settings
        </Title>

        <Stack gap={4}>
          <Text size="sm">Display Brightness</Text>
          <Slider
            label={null}
            key={form.key(PanelField.Brightness)}
            {...form.getInputProps(PanelField.Brightness)}
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
                    key={form.key(PanelField.PwnLsbNanoseconds)}
                    {...form.getInputProps(PanelField.PwnLsbNanoseconds)}
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
                    key={form.key(PanelField.GpioSlowdown)}
                    {...form.getInputProps(PanelField.GpioSlowdown)}
                  />
                </Stack>

                <Stack gap={4}>
                  <Stack gap={0}>
                    <Text size="sm">PWN Bits</Text>
                    <Text c="dimmed" size="xs">
                      Lower values will increase performance at the expense of
                      color precision.
                    </Text>
                  </Stack>
                  <Slider
                    max={11}
                    min={1}
                    key={form.key(PanelField.PwmBits)}
                    {...form.getInputProps(PanelField.PwmBits)}
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
