"use client";

import { ActionIcon, Card, Group, Menu, Modal, Text } from "@mantine/core";
import { Panel as PanelType, Preset, ScheduledPreset } from "../types";
import { LivePanelPreview } from "./LivePanelPreview";
import { useDisclosure } from "@mantine/hooks";
import { PresetForm } from "./PresetForm";
import {
  createCustomScheduledPreset,
  updateScheduledPreset,
} from "@/server/actions/scheduledPreset";
import { reloadHardwareScene } from "@/server/actions/hardware";
import { showNotification } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { updatePreset } from "@/server/actions/presets";

interface PanelProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  headerAction?: ReactNode;
}

export default function Panel({
  panel,
  scheduledPreset,
  headerAction,
}: PanelProps) {
  const [customPresetModalOpen, customPresetModalHandlers] = useDisclosure();

  const [presetEditting, setPresetEditting] = useState<Preset | null>(null);

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
      <Card padding="lg" radius="md" bg="transparent" style={{ width: "100%" }}>
        <Card.Section py="xs">
          <Group justify="space-between">
            <Text
              size="xl"
              ff="Pixelify Sans"
              fw={600}
              data-testid="panel-name"
            >
              {panel.name}
            </Text>
            <Group gap="xs" align="center" wrap="nowrap">
              {headerAction}
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
          </Group>
        </Card.Section>
        <Card.Section>
          <div style={{ position: "relative" }}>
            <LivePanelPreview isDefaultPreset={!scheduledPreset?.preset} />
          </div>
        </Card.Section>
      </Card>
    </>
  );
}
