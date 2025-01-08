"use client";

import { AppShell, Burger, Divider, Group, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

function App({ children }: { children: React.ReactNode }) {
  const [navOpened, { toggle: toggleNav }] = useDisclosure();

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
        <NavLink component={Link} href="/" label="Panel" />
        <NavLink
          component={Link}
          href="/presets"
          label="Presets"
          data-testid="nav-presets"
        />
        <NavLink component={Link} href="/composer" label="Composer" />
        <Divider />
        <NavLink component={Link} href="/settings" label="Settings" />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default App;
