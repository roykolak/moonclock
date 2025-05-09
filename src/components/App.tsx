"use client";

import {
  ActionIcon,
  Alert,
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconDeviceTv,
  IconExclamationCircleFilled,
  IconLayersIntersect,
  IconSpray,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { version } from "../../package.json";

function App({ children }: { children: React.ReactNode }) {
  const [navOpened, { toggle: toggleNav }] = useDisclosure();

  const pathname = usePathname();

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
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          href="/"
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
          data-testid="nav-presets"
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
        {version}
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
