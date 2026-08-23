"use client";

import { ActionIcon, Card, Group, Menu, Text } from "@mantine/core";
import { Panel as PanelType, ScheduledPreset } from "../types";
import { LivePanelPreview } from "./LivePanelPreview";
import { DeviceApi } from "@/client/deviceApi";
import { showNotification } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import { ReactNode } from "react";

interface PanelProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  api: DeviceApi;
  nameControl?: ReactNode;
  headerAction?: ReactNode;
}

export default function Panel({
  panel,
  scheduledPreset,
  api,
  nameControl,
  headerAction,
}: PanelProps) {
  return (
    <Card padding="lg" radius="md" bg="transparent" style={{ width: "100%" }}>
      <Card.Section py="xs">
        <Group justify="space-between">
          {nameControl ?? (
            <Text size="xl" ff="Pixelify Sans" fw={600} data-testid="panel-name">
              {panel.name}
            </Text>
          )}
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
                <Menu.Item onClick={() => api.pressButton()}>
                  Simulate Button Press
                </Menu.Item>
                <Menu.Item
                  onClick={async () => {
                    showNotification({ message: "Reloaded hardware" });
                    await api.reloadHardware();
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
          <LivePanelPreview
            streamUrl={api.panelStreamUrl}
            isDefaultPreset={!scheduledPreset?.preset}
          />
        </div>
      </Card.Section>
    </Card>
  );
}
