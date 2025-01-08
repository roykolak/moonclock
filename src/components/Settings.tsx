"use client";

import { setPanel } from "@/server/actions";
import { Panel } from "@/types";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface SettingsProps {
  panel: Panel;
}

export function Settings({ panel }: SettingsProps) {
  const form = useForm<Panel>({
    initialValues: {
      ...panel,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => setPanel(values))}
      data-testid="preset-form"
    >
      <Stack>
        <TextInput
          placeholder=""
          variant="filled"
          style={{ flex: 1 }}
          label="Name"
          required
          data-testid="panel-name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

        <Button type="submit" fullWidth>
          Save
        </Button>
      </Stack>
    </form>
  );
}
