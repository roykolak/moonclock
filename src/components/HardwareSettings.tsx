import { filterQueuedFramesSnapshotsBySeconds } from "@/helpers/filterQueuedFramesSnapshotsBySeconds";
import { reloadHardwareScene } from "@/server/actions/hardware";
import { HardwareState, SceneName } from "@/types";
import { LineChart } from "@mantine/charts";
import {
  Button,
  Divider,
  Grid,
  Group,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { PresetPreview } from "./PresetPreview";

function getTimeFromDate(date: Date) {
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function HardwareSettings({
  hardwareState = null,
}: {
  hardwareState: HardwareState | null;
}) {
  if (!hardwareState) return null;

  const {
    queuedFramesSnapshots,
    preset,
    renderedAt,
    lastLoopRunAt,
    brightness,
  } = hardwareState;

  const filteredSnapshots = filterQueuedFramesSnapshotsBySeconds(
    queuedFramesSnapshots
  );

  return (
    <Stack gap={0}>
      <Stack>
        <Grid>
          <Grid.Col span={3}>
            <PresetPreview
              preset={{
                name: "hardware",
                mode: "for",
                forTime: "0:00",
                untilDay: "0",
                untilHour: "0",
                untilMinute: "0",
                scenes: [
                  {
                    sceneName: SceneName.Hardware,
                    sceneConfig: { coordinates: hardwareState.virtualPanel },
                  },
                ],
              }}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <Grid gutter={0}>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" fw="bold">
                  Scenes:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm">
                  {preset?.scenes
                    ?.map(({ sceneName }: any) => sceneName)
                    .join(", ")}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" fw="bold">
                  Rendered at:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm">
                  {new Date(renderedAt).toLocaleString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" fw="bold">
                  Last loop run:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm">
                  {new Date(lastLoopRunAt).toLocaleString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" mb="xs" fw="bold">
                  Brightness:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm" mb="xs">
                  {brightness}
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Stack>
      <Divider my="sm" />
      <Text mt="md">Framerate health</Text>
      <Stack gap="xs">
        <LineChart
          h={100}
          data={filteredSnapshots}
          dataKey="timestamp"
          yAxisProps={{ domain: [0, 80] }}
          style={{ minWidth: 0 }}
          series={[
            {
              name: "count",
              color: "cyan.6",
            },
          ]}
          referenceLines={[
            {
              y: 50,
              label: "Frames dropped",
              color: "red.2",
              opacity: 0.3,
            },
          ]}
          curveType="linear"
          tickLine="none"
          gridAxis="none"
          withYAxis={false}
          withXAxis={false}
          withDots={false}
          withTooltip={false}
        />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {getTimeFromDate(new Date(filteredSnapshots?.[0]?.timestamp))}
          </Text>
          <Text size="sm" c="dimmed">
            {getTimeFromDate(
              new Date(
                filteredSnapshots?.[filteredSnapshots?.length - 1]?.timestamp
              )
            )}
          </Text>
        </Group>
        <Text>Add frame delay (ms)</Text>
        <Slider
          color="blue"
          defaultValue={hardwareState.syncSpeed}
          onChangeEnd={(value) => {
            fetch(`http://${window.location.hostname}:3001/api/throttle`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                value,
              }),
            });
          }}
        />
      </Stack>
      <Divider my="sm" />
      <Button
        fullWidth
        variant="light"
        onClick={async () => {
          showNotification({ message: "Reloaded hardware" });
          await reloadHardwareScene();
        }}
      >
        Reload Hardware
      </Button>
    </Stack>
  );
}
