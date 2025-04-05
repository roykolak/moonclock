import { Preset } from "@/types";
import { Accordion, Grid, Stack, Text } from "@mantine/core";

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
  return (
    <Accordion defaultValue="Apples" variant="filled" mt="xs">
      <Accordion.Item key="hardware" value="hardware">
        <Accordion.Control>
          <Text size="sm" c="dimmed">
            Hardware Details
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
                  {hardwarePreset.scenes[0]?.sceneName} scene
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
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
