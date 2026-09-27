"use client";

import { ActionIcon, Card, Group, Menu, Text } from "@mantine/core";
import { Panel as PanelType, ScheduledPreset } from "../types";
import { LivePanelPreview } from "./LivePanelPreview";
import { rebootMachine, reloadHardware } from "@/app/actions";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import { ReactNode } from "react";

interface PanelProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  hardwarePort: number;
  nameControl?: ReactNode;
  headerAction?: ReactNode;
}

export default function Panel({
  panel,
  scheduledPreset,
  hardwarePort,
  nameControl,
  headerAction,
}: PanelProps) {
  const router = useRouter();
  const hostname =
    typeof window === "undefined" ? "localhost" : window.location.hostname;
  const hardwareOrigin = `http://${hostname}:${hardwarePort}`;

  return (
    <Card padding="lg" radius="md" bg="transparent" style={{ width: "100%" }}>
      <Card.Section py="xs">
        <Group justify="space-between">
          {nameControl ?? (
            <Text
              size="xl"
              ff="Pixelify Sans"
              fw={600}
              data-testid="panel-name"
            >
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
                <Menu.Item
                  onClick={async () => {
                    await fetch(`${hardwareOrigin}/api/button-press`, {
                      method: "POST",
                    });
                    router.refresh();
                  }}
                >
                  Simulate Button Press
                </Menu.Item>
                <Menu.Item
                  onClick={async () => {
                    showNotification({ message: "Reloaded hardware" });
                    await reloadHardware();
                  }}
                >
                  Reload Hardware
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  data-testid="reboot-machine"
                  onClick={async () => {
                    showNotification({ message: "Rebooting machine" });
                    await rebootMachine();
                  }}
                >
                  Reboot Machine
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
            streamUrl={`${hardwareOrigin}/api/panel/stream`}
            isDefaultPreset={!scheduledPreset?.preset}
          />
        </div>
      </Card.Section>
    </Card>
  );
}
