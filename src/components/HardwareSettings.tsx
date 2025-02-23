import { reloadHardwareScene } from "@/server/actions/hardware";
import { Preset } from "@/types";
import { Accordion, Button, Grid, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useTransition } from "react";

interface HardwareSettingsProps {
  formattedLastHeartbeat: string | null;
  formattedHardwareRenderedAt: string | null;
  hardwarePreset: Preset;
}

export function HardwareSettings({
  hardwarePreset,
  formattedLastHeartbeat,
  formattedHardwareRenderedAt,
}: HardwareSettingsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Accordion defaultValue="Apples" variant="filled" mt="xs">
      <Accordion.Item key="hardware" value="hardware">
        <Accordion.Control>
          <Text size="sm" c="dimmed">
            Hardware Settings
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Grid gutter={0}>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" fw="bold">
                  Scene:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm">
                  {hardwarePreset.scenes[0].sceneName} scene
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" fw="bold">
                  Rendered at:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm">
                  {formattedHardwareRenderedAt}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" mb="xs" fw="bold">
                  Last loop run:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm" mb="xs">
                  {formattedLastHeartbeat}
                </Text>
              </Grid.Col>
            </Grid>
            <Button
              size="xs"
              variant="light"
              loading={isPending}
              onClick={async () => {
                startTransition(async () => {
                  await reloadHardwareScene();
                  showNotification({ message: "Hardware Scene reloaded!" });
                });
              }}
            >
              Reload Hardware Display
            </Button>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
