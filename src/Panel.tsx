"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { changeEndTime, setActiveSlot } from "./server/actions";
import Display from "./Display";
import { Panel as PanelType, Preset, SceneData } from "./types";
import { useDisclosure } from "@mantine/hooks";
import { getEndDate } from "./PresetsList";
import { PresetForm } from "./PresetForm";

export default function Panel({
  panel,
  scenes,
  presets,
}: {
  panel: PanelType;
  presets: Preset[];
  scenes: SceneData[];
}) {
  const [editOpened, editHandlers] = useDisclosure();

  return (
    <>
      <PresetForm
        showName={false}
        opened={editOpened}
        onClose={editHandlers.close}
        scenes={scenes}
        preset={null}
        onSubmit={(values) => {
          const endDate = getEndDate(values);

          setActiveSlot({
            scene: values.scene,
            endTime: endDate ? endDate.toJSON() : null,
          });
        }}
      />
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={700}>Winnie&apos;s Room</Text>
            {panel.activeSlot && (
              <Button
                variant="light"
                color="red"
                size="compact-sm"
                onClick={() => {
                  setActiveSlot(null);
                }}
              >
                Clear
              </Button>
            )}
          </Group>
        </Card.Section>
        <Card.Section>
          <div style={{ position: "relative" }}>
            <Display
              layers={panel.macros}
              dimensions={{ height: 32, width: 32 }}
            />
            {!panel.activeSlot && (
              <Stack
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {presets.map((preset, i) => (
                  <Button
                    key={`preset-${i}`}
                    variant="filled"
                    fullWidth
                    onClick={() => {
                      const endDate = getEndDate(preset);
                      setActiveSlot({
                        endTime: endDate?.toJSON() || null,
                        scene: preset.scene,
                      });
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
                <Button
                  variant="light"
                  fullWidth
                  onClick={() => {
                    editHandlers.open();
                  }}
                >
                  Custom...
                </Button>
              </Stack>
            )}
          </div>

          {panel.activeSlot && (
            <Flex p="lg">
              <Box>
                <Stack gap={4}>
                  <Center>
                    <Text>Showing {panel.activeSlot.scene} until...</Text>
                  </Center>
                  <Badge
                    color="gray"
                    radius="sm"
                    style={{
                      height: 50,
                      padding: "8px 16px",
                      fontSize: 38,
                      lineHeight: 38,
                    }}
                    styles={{
                      label: { color: "#CCC" },
                    }}
                  >
                    {panel.activeSlot.endTime
                      ? new Date(panel.activeSlot.endTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "forever"}
                  </Badge>
                </Stack>
              </Box>
              <Box flex="auto"></Box>
              <Flex gap="lg">
                <Stack gap={8}>
                  <Button
                    variant="filled"
                    disabled={panel.activeSlot.endTime === null}
                    onClick={() => changeEndTime(5)}
                  >
                    +5 min
                  </Button>
                  <Button
                    variant="filled"
                    disabled={panel.activeSlot.endTime === null}
                    onClick={() => changeEndTime(-5)}
                  >
                    -5 min
                  </Button>
                </Stack>
              </Flex>
            </Flex>
          )}
        </Card.Section>
      </Card>
    </>
  );
}
