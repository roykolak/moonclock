"use client";

import {
  ActionIcon,
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
} from "@mantine/core";
import {
  Panel as PanelType,
  Preset,
  PresetField,
  ScheduledPreset,
} from "../types";
import { getEndDate } from "@/helpers/getEndDate";
import { PresetPreview } from "./PresetPreview";
import { useDisclosure } from "@mantine/hooks";
import { PresetForm } from "./PresetForm";
import {
  changeEndTime,
  createCustomScheduledPreset,
  updateScheduledPreset,
} from "@/server/actions/scheduledPreset";
import { HardwareSettings } from "./HardwareSettings";
import { IconDots } from "@tabler/icons-react";
import { reloadHardwareScene } from "@/server/actions/hardware";
import { showNotification } from "@mantine/notifications";
import { getFriendlyTimeAdjustmentAmount } from "@/helpers/getFriendlyTimeAdjustmentAmount";

interface PanelProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  formattedEndTime: string | null;
  formattedLastHeartbeat: string | null;
  formattedHardwareRenderedAt: string | null;
  customSceneNames: string[];
  hardwarePreset: Preset;
}

export default function Panel({
  panel,
  hardwarePreset,
  scheduledPreset,
  formattedEndTime,
  formattedLastHeartbeat,
  formattedHardwareRenderedAt,
  presets,
  customSceneNames,
}: PanelProps) {
  const [customPresetModalOpen, customPresetModalHandlers] = useDisclosure();

  const timeAdjustment = parseInt(
    scheduledPreset?.preset?.[PresetField.TimeAdjustmentAmount] ||
      panel.timeAdjustmentAmount,
    10
  );

  return (
    <>
      <Modal
        opened={customPresetModalOpen}
        title={"Set custom preset"}
        onClose={customPresetModalHandlers.close}
      >
        <PresetForm
          customSceneNames={customSceneNames}
          preset={{ name: "Custom Preset" } as Preset}
          action={async (preset) => {
            await createCustomScheduledPreset(preset);
            customPresetModalHandlers.close();
          }}
          submitLabel="Apply now"
        />
      </Modal>
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
                  variant="subtle"
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
                    updateScheduledPreset({
                      preset: null,
                      endTime: null,
                    });
                  }}
                >
                  Clear Scene
                </Menu.Item>
                <Menu.Item
                  onClick={async () => {
                    showNotification({
                      message: "Hardware Scene reloading...",
                    });
                    await reloadHardwareScene();
                  }}
                >
                  Reload Hardware
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>
        <Card.Section>
          <div style={{ position: "relative" }}>
            <PresetPreview
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
                  onClick={customPresetModalHandlers.open}
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
      <HardwareSettings
        hardwarePreset={hardwarePreset}
        formattedLastHeartbeat={formattedLastHeartbeat}
        formattedHardwareRenderedAt={formattedHardwareRenderedAt}
      />
    </>
  );
}
