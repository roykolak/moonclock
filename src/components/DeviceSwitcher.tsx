"use client";

import { Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { Device } from "@/types";

interface DeviceSwitcherProps {
  name: string;
  localName: string;
  localDeviceId: string;
  selectedDeviceId: string;
  peers: Device[];
  onSelect: (deviceId: string) => void;
}

export function DeviceSwitcher({
  name,
  localName,
  localDeviceId,
  selectedDeviceId,
  peers,
  onSelect,
}: DeviceSwitcherProps) {
  const entries = [
    { id: localDeviceId, name: localName, detail: "this clock" },
    ...peers.map((peer) => ({
      id: peer.id,
      name: peer.name,
      detail: peer.address ?? peer.host,
    })),
  ];

  return (
    <Menu withinPortal position="bottom-start" shadow="sm">
      <Menu.Target>
        <UnstyledButton data-testid="device-switcher">
          <Group gap={4} align="center" wrap="nowrap">
            <Text
              size="xl"
              ff="Pixelify Sans"
              fw={600}
              data-testid="panel-name"
            >
              {name}
            </Text>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Clocks on this network</Menu.Label>
        {entries.map((entry) => (
          <Menu.Item
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            fw={entry.id === selectedDeviceId ? 600 : undefined}
            leftSection={
              <IconCheck
                size={16}
                style={{ opacity: entry.id === selectedDeviceId ? 1 : 0 }}
              />
            }
          >
            <Text size="sm">{entry.name}</Text>
            <Text size="xs" c="dimmed">
              {entry.detail}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
