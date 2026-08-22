"use client";

import { ActionIcon, Card, Group, Menu, Text } from "@mantine/core";
import { Panel as PanelType, ScheduledPreset } from "../types";
import { LivePanelPreview } from "./LivePanelPreview";
import { reloadHardwareScene } from "@/server/actions/hardware";
import { showNotification } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import { ReactNode } from "react";

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
  return (
    <Card padding="lg" radius="md" bg="transparent" style={{ width: "100%" }}>
      <Card.Section py="xs">
        <Group justify="space-between">
          <Text size="xl" ff="Pixelify Sans" fw={600} data-testid="panel-name">
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
        <div
          style={{
            position: "relative",
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
          }}
        >
          <LivePanelPreview isDefaultPreset={!scheduledPreset?.preset} />
        </div>
      </Card.Section>
    </Card>
  );
}
