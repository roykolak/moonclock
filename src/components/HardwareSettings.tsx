import { LineChart } from "@mantine/charts";
import { Accordion, Divider, Grid, Stack, Text } from "@mantine/core";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

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

  if (data) {
    highestQueuedFrameSnapshot = Math.max(
      ...(data?.queuedFramesSnapshots?.map(({ count }: any) => count) || [])
    );
  }

  return (
    <Accordion defaultValue="Apples" variant="filled" mt="xs">
      <Accordion.Item key="hardware" value="hardware">
        <Accordion.Control
          icon={
            highestQueuedFrameSnapshot > 4 && (
              <IconExclamationCircleFilled color="#ff6b6b" opacity={0.6} />
            )
          }
        >
          <Text size="sm" c="dimmed">
            Hardware Details
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
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
                  {data.renderedAt}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text c="dimmed" size="sm" mb="xs" fw="bold">
                  Last loop run:
                </Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text c="dimmed" size="sm" mb="xs">
                  {data.lastLoopRunAt}
                </Text>
              </Grid.Col>
            </Grid>
          </Stack>
          <Divider my="sm" />
          <Text c="dimmed" size="sm" mb="ms">
            Framerate Health
          </Text>
          <LineChart
            h={45}
            data={data.queuedFramesSnapshots}
            dataKey="timestamp"
            yAxisProps={{ domain: [0, 100] }}
            series={[
              {
                name: "count",
                color: "cyan.6",
              },
            ]}
            referenceLines={[
              {
                y: 50,
                color: "red.4",
              },
            ]}
            curveType="linear"
            tickLine="none"
            gridAxis="none"
            withYAxis={false}
            withXAxis={false}
            withDots={false}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
