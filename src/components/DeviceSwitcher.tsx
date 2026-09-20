"use client";

import { useState } from "react";
import { Group, Loader, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconCheck, IconChevronDown, IconRadar } from "@tabler/icons-react";
import { Peers } from "./usePeers";

interface DeviceSwitcherProps {
  name: string;
  localName: string;
  localDeviceId: string;
  selectedDeviceId: string;
  peers: Peers;
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
  const [opened, setOpened] = useState(false);
  const { devices, searching, search } = peers;

  const entries = [
    { id: localDeviceId, name: localName, detail: "this clock" },
    ...devices.map((peer) => ({
      id: peer.id,
      name: peer.name,
      detail: peer.address ?? peer.host,
    })),
  ];

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      closeOnItemClick={false}
      withinPortal
      position="bottom-start"
      shadow="sm"
    >
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
            onClick={() => {
              setOpened(false);
              onSelect(entry.id);
            }}
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
        <Menu.Divider />
        <Menu.Item
          onClick={() => search()}
          disabled={searching}
          data-testid="search-for-clocks"
          leftSection={
            searching ? (
              <Loader size={16} data-testid="searching" />
            ) : (
              <IconRadar size={16} />
            )
          }
        >
          <Text size="sm">Look for more clocks</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
