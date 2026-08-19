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
import { Panel as PanelType, Preset, ScheduledPreset } from "../types";
import { getEndDate } from "@/helpers/getEndDate";
import { LivePanelPreview } from "./LivePanelPreview";
import { useDisclosure } from "@mantine/hooks";
import { PresetForm } from "./PresetForm";
import {
  changeEndTime,
  createCustomScheduledPreset,
  updateScheduledPreset,
} from "@/server/actions/scheduledPreset";
import { reloadHardwareScene } from "@/server/actions/hardware";
import { showNotification } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import { getFriendlyTimeAdjustmentAmount } from "@/helpers/getFriendlyTimeAdjustmentAmount";
import { useState } from "react";
import { updatePreset } from "@/server/actions/presets";

interface PanelProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  formattedEndTime: string | null;
}

export default function Panel({
  panel,
  scheduledPreset,
  formattedEndTime,
  presets,
}: PanelProps) {
  const [customPresetModalOpen, customPresetModalHandlers] = useDisclosure();

  const [presetEditting, setPresetEditting] = useState<Preset | null>(null);

  const timeAdjustment = parseInt(
    scheduledPreset?.preset?.timeAdjustmentAmount || panel.timeAdjustmentAmount,
    10,
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
                <Menu.Divider />
                <Menu.Item
                  onClick={async () => {
                    await fetch(
                      `http://${window.location.hostname}:3001/api/button-press`,
                      { method: "POST" },
                    );
                  }}
                >
                  Simulate Button Press
                </Menu.Item>
                <Menu.Item
                  onClick={async () => {
                    showNotification({ message: "Reloaded hardware" });
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
            <LivePanelPreview isDefaultPreset={!scheduledPreset?.preset} />

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
