"use client";

import {
  ActionIcon,
  Alert,
  AppShell,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconCpu,
  IconDeviceTv,
  IconExclamationCircleFilled,
  IconLayersIntersect,
  IconRefresh,
  IconSpray,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import packageInfo from "../../package.json";
import { UpdatePrompt } from "./UpdatePrompt";
import { NextVersion } from "@/types";

function App({
  children,
  nextVersion,
}: {
  children: React.ReactNode;
  nextVersion: NextVersion | null;
}) {
  const [navOpened, { toggle: toggleNav }] = useDisclosure();
  const [checkingForUpdate, setCheckingForUpdate] = useState(false);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleCheckForUpdate = async () => {
    setCheckingForUpdate(true);
    try {
      const response = await fetch("/api/check-for-update", { method: "PUT" });
      const data = await response.json();
      if (data.available) {
        router.refresh();
        setReleaseNotesOpen(true);
      } else if (data.message?.includes("Error")) {
        showNotification({ message: data.message, color: "red" });
      }
    } catch {
      showNotification({
        message: "Failed to check for update",
        color: "red",
      });
    } finally {
      setCheckingForUpdate(false);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !navOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group align="center" h="100%" px="md">
          <Burger
            opened={navOpened}
            onClick={toggleNav}
            hiddenFrom="sm"
            size="sm"
            data-testid="app-menu"
          />
          <Text flex={1}>Moon Clock</Text>
          <UpdatePrompt
            nextVersion={nextVersion}
            releaseNotesOpen={releaseNotesOpen}
            onReleaseNotesOpenChange={setReleaseNotesOpen}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          href="/panel"
          label="Panel"
          active={pathname.includes("/panel")}
          leftSection={
            <ActionIcon variant="light">
              <IconDeviceTv
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          }
        />
        <NavLink
          component={Link}
          href="/presets"
          label="Presets"
          active={pathname.includes("/presets")}
          leftSection={
            <ActionIcon variant="light">
              <IconLayersIntersect
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          }
        />
        <NavLink
          component={Link}
          href="/composer"
          label="Composer"
          active={pathname.includes("/composer")}
          leftSection={
            <ActionIcon variant="light">
              <IconSpray style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          }
        />
        <NavLink
          component={Link}
          href="/settings"
          label="Settings"
          active={pathname.includes("/settings")}
          leftSection={
            <ActionIcon variant="light">
              <IconAdjustmentsHorizontal
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          }
        />

        <Divider my="xs" />
        <NavLink
          component={Link}
          href="/hardware"
          label="Hardware"
          active={pathname.includes("/hardware")}
          leftSection={
            <ActionIcon variant="light">
              <IconCpu style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          }
        />

        <Box flex="auto"></Box>
        <Group justify="space-between" align="center">
          <Text c="dimmed" size="sm">
            v{packageInfo.version}
          </Text>
          <Button
            size="compact-xs"
            variant="subtle"
            color="gray"
            leftSection={<IconRefresh size={14} stroke={1.5} />}
            onClick={handleCheckForUpdate}
            loading={checkingForUpdate}
            data-testid="check-for-update-button"
          >
            Check for updates
          </Button>
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>
        <ErrorBoundary
          fallbackRender={({ error }) => {
            console.log(error.stack);
            return (
              <Alert
                title="There was a problem!"
                color="red"
                icon={<IconExclamationCircleFilled />}
              >
                {error.message}
              </Alert>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
