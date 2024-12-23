"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { changeEndTime, setActiveSlot } from "../server/actions";
import Display from "./Display";
import { Preset, Scene, Slot } from "../types";
import { getEndDate } from "../utils";
import Link from "next/link";

interface PanelProps {
  activeSlot: Slot | null;
  presets: Preset[];
  scenes: Scene[];
  formattedEndTime: string | null;
}

export default function Panel({
  activeSlot,
  formattedEndTime,
  scenes,
  presets,
}: PanelProps) {
  const scene = scenes.find(({ name }) => name === activeSlot?.sceneName);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={700}>Winnie&apos;s Room</Text>
          {activeSlot && (
            <Button
              variant="light"
              color="red"
              size="compact-sm"
              onClick={() => {
                setActiveSlot(null);
              }}
            >
              Clear
            </Button>
          )}
        </Group>
      </Card.Section>
      <Card.Section>
        <div style={{ position: "relative" }}>
          <Display scene={scene} />

          {!activeSlot && (
            <Stack
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {presets.map((preset, i) => (
                <Button
                  key={`preset-${i}`}
                  variant="filled"
                  fullWidth
                  onClick={() => {
                    const endDate = getEndDate(preset);
                    setActiveSlot({
                      endTime: endDate?.toJSON() || null,
                      sceneName: preset.sceneName,
                    });
                  }}
                >
                  {preset.name}
                </Button>
              ))}
              <Button
                variant="light"
                fullWidth
                component={Link}
                href="/presets/new?setActiveSlot=true"
              >
                Custom...
              </Button>
            </Stack>
          )}
        </div>

        {activeSlot && (
          <Flex p="lg">
            <Box>
              <Stack gap={4}>
                <Center>
                  <Text>Showing {activeSlot.sceneName} until...</Text>
                </Center>
                <Badge
                  color="gray"
                  radius="sm"
                  style={{
                    height: 50,
                    padding: "8px 16px",
                    fontSize: 38,
                    lineHeight: 38,
                  }}
                  styles={{
                    label: { color: "#CCC" },
                  }}
                >
                  {formattedEndTime}
                </Badge>
              </Stack>
            </Box>
            <Box flex="auto"></Box>
            <Flex gap="lg">
              <Stack gap={8}>
                <Button
                  variant="filled"
                  disabled={activeSlot.endTime === null}
                  onClick={() => changeEndTime(5)}
                >
                  +5 min
                </Button>
                <Button
                  variant="filled"
                  disabled={activeSlot.endTime === null}
                  onClick={() => changeEndTime(-5)}
                >
                  -5 min
                </Button>
              </Stack>
            </Flex>
          </Flex>
        )}
      </Card.Section>
    </Card>
  );
}
