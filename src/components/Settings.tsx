"use client";

import { updatePanel } from "@/server/actions/panel";
import { Panel, SceneName } from "@/types";
import { Button, Select, Stack, TextInput, Title } from "@mantine/core";
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
          key={form.key("name")}
          name={"name"}
          {...form.getInputProps("name")}
        />

        <Select
          placeholder="Scene"
          variant="filled"
          style={{ flex: 1 }}
          label="Default Scene"
          description="What will be shown when nothing is active"
          data={[
            {
              group: "Built-in Scenes",
              items: [
                SceneName.Blank,
                SceneName.Moon,
                SceneName.Countdown,
                SceneName.Twinkle,
              ],
            },
            {
              group: "Custom Scenes",
              items: customSceneNames,
            },
          ]}
          data-testid="default-scene-select"
          required
          key={form.key(`defaultPreset.scene.layers.0.sceneName`)}
          name={`defaultScenes.0.sceneName`}
          {...form.getInputProps(`defaultPreset.scene.layers.0.sceneName`)}
        />

        <Button type="submit" fullWidth mt="md">
          Save
        </Button>
      </Stack>
    </form>
  );
}
