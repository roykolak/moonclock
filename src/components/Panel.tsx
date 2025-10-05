"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  HardwareState,
  Panel as PanelType,
  Preset,
  PresetField,
  ScheduledPreset,
} from "../types";
import { getEndDate } from "@/helpers/getEndDate";
import { useDisclosure } from "@mantine/hooks";
import { PresetForm } from "./PresetForm";
import {
  changeEndTime,
  createCustomScheduledPreset,
  updateScheduledPreset,
} from "@/server/actions/scheduledPreset";
import { HardwareSettings } from "./HardwareSettings";
import { IconDots } from "@tabler/icons-react";
import { getFriendlyTimeAdjustmentAmount } from "@/helpers/getFriendlyTimeAdjustmentAmount";
import { useEffect, useState } from "react";
import { isFrameRateLagging } from "@/helpers/isFrameRateLagging";
import { updatePreset } from "@/server/actions/presets";
import { CurrentPreset } from "./CurrentPreset";

interface PanelProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  formattedEndTime: string | null;
  customSceneNames: string[];
}

export default function Panel({
  panel,
  scheduledPreset,
  formattedEndTime,
  presets,
  customSceneNames,
}: PanelProps) {
  const [customPresetModalOpen, customPresetModalHandlers] = useDisclosure();
  const [hardwareModalOpen, hardwareModalHandlers] = useDisclosure();

  const [presetEditting, setPresetEditting] = useState<Preset | null>(null);

  const [hardwareState, setHardwareState] = useState<HardwareState | null>(
    null
  );

  const theme = useMantineTheme();

  useEffect(() => {
    const loop = setInterval(() => {
      fetch(`http://${window.location.hostname}:3001/api/state`)
        .then((response) => response.json())
        .then(setHardwareState);
    }, 1000);
    return () => clearInterval(loop);
  }, []);

  const timeAdjustment = parseInt(
    scheduledPreset?.preset?.[PresetField.TimeAdjustmentAmount] ||
      panel.timeAdjustmentAmount,
    10
  );

  return (
    <>
      <Modal
        opened={customPresetModalOpen}
        title={
          scheduledPreset?.preset?.id ? "Update Preset" : "Set Custom Preset"
        }
        onClose={customPresetModalHandlers.close}
      >
        <PresetForm
          customSceneNames={customSceneNames}
          preset={presetEditting}
          action={async (preset) => {
            await createCustomScheduledPreset(preset);
            if (preset.id) {
              updatePreset(preset);
            }
            customPresetModalHandlers.close();
          }}
          submitLabel={scheduledPreset?.preset?.id ? "Update" : "Apply now"}
        />
      </Modal>
      <Modal
        title="Hardware Status"
        opened={hardwareModalOpen}
        onClose={hardwareModalHandlers.close}
      >
        <HardwareSettings hardwareState={hardwareState} />
      </Modal>
      {isFrameRateLagging(hardwareState) && (
        <Alert color="red" p="xs" mb="md">
          <Stack>
            <Group justify="space-between" w="100%">
              <Text c={theme.colors.red[5]}>Framerate is lagging!</Text>
              <Button
                variant="light"
                color="red"
                size="compact-sm"
                onClick={hardwareModalHandlers.open}
              >
                More..
              </Button>
            </Group>
            <Text c={theme.colors.red[1]} size="sm">
              To improve the framerate, try reducing the speed of your scenes or
              removing scenes.
            </Text>
          </Stack>
        </Alert>
      )}
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ maxWidth: 500 }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={700} data-testid="panel-name">
              {panel.name}
            </Text>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  color="gray"
                  data-testid="panel-menu"
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  disabled={!scheduledPreset?.preset}
                  onClick={() => {
                    setPresetEditting(scheduledPreset?.preset as Preset);
                    customPresetModalHandlers.open();
                  }}
                >
                  Edit Preset
                </Menu.Item>
                <Menu.Item
                  disabled={!scheduledPreset?.preset}
                  onClick={() => {
                    updateScheduledPreset({
                      preset: null,
                      endTime: null,
                    });
                  }}
                >
                  Clear Panel
                </Menu.Item>
                <Menu.Item onClick={hardwareModalHandlers.open}>
                  Hardware...
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>
        <Card.Section>
          <div style={{ position: "relative" }}>
            <CurrentPreset
              preset={scheduledPreset?.preset || panel.defaultPreset}
              isDefaultPreset={!scheduledPreset?.preset}
            />

            {!scheduledPreset?.preset && (
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
                      updateScheduledPreset({
                        preset: preset,
                        endTime: endDate?.toJSON() || null,
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
                    setPresetEditting({ name: "Custom" } as Preset);
                    customPresetModalHandlers.open();
                  }}
                >
                  Custom...
                </Button>
              </Stack>
            )}
          </div>

          {scheduledPreset?.preset && (
            <Flex p="lg">
              <Box>
                <Stack gap={4}>
                  <Center>
                    <Text>{scheduledPreset.preset.name} until...</Text>
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
                    data-testid="end-time"
                  >
                    {formattedEndTime}
                  </Badge>
                </Stack>
              </Box>
              <Box flex="auto"></Box>
              <Flex gap="lg">
                <Stack gap={8}>
                  <Button
                    variant="filled"
                    disabled={scheduledPreset.endTime === null}
                    onClick={() => {
                      changeEndTime(timeAdjustment);
                    }}
                  >
                    {getFriendlyTimeAdjustmentAmount(timeAdjustment)}
                  </Button>
                  <Button
                    variant="filled"
                    disabled={scheduledPreset.endTime === null}
                    onClick={() => changeEndTime(-timeAdjustment)}
                  >
                    {getFriendlyTimeAdjustmentAmount(-timeAdjustment)}
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
