import { reloadHardwareScene } from "@/server/actions/hardware";
import { LineChart } from "@mantine/charts";
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";

function getTimeFromDate(date: Date) {
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function HardwareSettings() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const loop = setInterval(() => {
      fetch(`http://${window.location.hostname}:3001/api/state`)
        .then((response) => response.json())
        .then(setData);
    }, 1000);

    return () => clearInterval(loop);
  }, []);

  let highestQueuedFrameSnapshot = 0;

  if (data?.queuedFramesSnapshots) {
    highestQueuedFrameSnapshot = Math.max(
      ...(data.queuedFramesSnapshots.map(({ count }: any) => count) || [])
    );
  }

  const framerateLagging = highestQueuedFrameSnapshot > 4;

  return (
    <Stack gap={0}>
      {framerateLagging && (
        <Alert color="red" title="Framerate is lagging!" p="xs" mb="md">
          Try reducing the speed of your scenes or removing scenes
        </Alert>
      )}
      <Stack>
        <Grid gutter={0}>
          <Grid.Col span={4}>
            <Text c="dimmed" size="sm" fw="bold">
              Scenes:
            </Text>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text c="dimmed" size="sm">
              {data.preset?.scenes
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
              {new Date(data.renderedAt).toLocaleString()}
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text c="dimmed" size="sm" mb="xs" fw="bold">
              Last loop run:
            </Text>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text c="dimmed" size="sm" mb="xs">
              {new Date(data.lastLoopRunAt).toLocaleString()}
            </Text>
          </Grid.Col>
        </Grid>
      </Stack>
      <Divider my="sm" />
      <Text mt="md">Framerate health</Text>
      <Stack gap="xs">
        <LineChart
          h={100}
          data={data.queuedFramesSnapshots}
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
            {getTimeFromDate(
              new Date(data.queuedFramesSnapshots?.[0]?.timestamp)
            )}
          </Text>
          <Text size="sm" c="dimmed">
            {getTimeFromDate(
              new Date(
                data.queuedFramesSnapshots?.[
                  data.queuedFramesSnapshots?.length - 1
                ]?.timestamp
              )
            )}
          </Text>
        </Group>
        <Text>Add frame delay (ms)</Text>
        <Slider
          color="blue"
          defaultValue={0}
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
