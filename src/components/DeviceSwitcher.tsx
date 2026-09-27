"use client";

import { useState } from "react";
import { Group, Loader, Menu, Text, UnstyledButton } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconChevronDown, IconRadar } from "@tabler/icons-react";
import { Device } from "@/types";
import { Peers } from "./usePeers";

const REACH_TIMEOUT_MS = 3000;

interface DeviceSwitcherProps {
  name: string;
  peers: Peers;
}

function appOrigin(device: Device) {
  const port = device.port === 80 ? "" : `:${device.port}`;
  return `http://${device.address}${port}`;
}

export function DeviceSwitcher({ name, peers }: DeviceSwitcherProps) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const { devices, searching, search } = peers;

  const open = async (device: Device) => {
    if (opening) return;
    setOpening(device.id);

    const origin = appOrigin(device);

    try {
      await fetch(origin, {
        mode: "no-cors",
        cache: "no-store",
        signal: AbortSignal.timeout(REACH_TIMEOUT_MS),
      });
      window.location.assign(origin);
    } catch {
      setOpening(null);
      showNotification({
        message: `Can't reach ${device.name}`,
        color: "red",
      });
    }
  };

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
        <Menu.Item
          onClick={() => setOpened(false)}
          fw={600}
          leftSection={<IconCheck size={16} />}
        >
          <Text size="sm">{name}</Text>
          <Text size="xs" c="dimmed">
            this clock
          </Text>
        </Menu.Item>
        {devices.map((device) => (
          <Menu.Item
            key={device.id}
            onClick={() => open(device)}
            disabled={opening != null}
            leftSection={
              opening === device.id ? (
                <Loader size={16} data-testid="opening-clock" />
              ) : (
                <IconCheck size={16} style={{ opacity: 0 }} />
              )
            }
          >
            <Text size="sm">{device.name}</Text>
            <Text size="xs" c="dimmed">
              {device.address}
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
