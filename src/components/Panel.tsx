"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { setSlot } from "../server/actions";
import { changeEndTime } from "../server/changeEndTime";
import { Panel as PanelType, Preset, Slot } from "../types";
import { useDisclosure } from "@mantine/hooks";
import { PresetForm } from "./PresetForm";
import { getEndDate } from "@/helpers/getEndDate";
import { PresetPreview } from "./PresetPreview";

interface PanelProps {
  panel: PanelType;
  slot: Slot | null;
  presets: Preset[];
  formattedEndTime: string | null;
  formattedLastHeartbeat: string | null;
}

export default function Panel({
  panel,
  slot,
  formattedEndTime,
  formattedLastHeartbeat,
  presets,
}: PanelProps) {
  const [presetModalOpen, presetModalHandlers] = useDisclosure();

  return (
    <>
      <Modal
        title="Custom Preset"
        opened={presetModalOpen}
        onClose={presetModalHandlers.close}
      >
        <PresetForm
          presets={presets}
          showName={false}
          onSubmit={(values) => {
            const endDate = getEndDate(values);

            setSlot({
              preset: { ...values, name: "Custom" },
              endTime: endDate ? endDate.toJSON() : null,
            });

            presetModalHandlers.close();
          }}
        />
      </Modal>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ maxWidth: 500 }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={700}>{panel.name}</Text>
            {slot && (
              <Button
                variant="light"
                color="red"
                size="compact-sm"
                onClick={() => {
                  setSlot(null);
                }}
              >
                Clear
              </Button>
            )}
          </Group>
        </Card.Section>
        <Card.Section>
          <div style={{ position: "relative" }}>
            <PresetPreview preset={slot?.preset} />

            {!slot?.preset && (
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
                      setSlot({
                        preset: preset,
                        endTime: endDate?.toJSON() || null,
                      });
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
                <Button
                  variant="light"
                  fullWidth
                  onClick={presetModalHandlers.open}
                >
                  Custom...
                </Button>
              </Stack>
            )}
          </div>

          {slot?.preset && (
            <Flex p="lg">
              <Box>
                <Stack gap={4}>
                  <Center>
                    <Text>{slot.preset.name} until...</Text>
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
                    data-testid="end-time"
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
                    disabled={slot.endTime === null}
                    onClick={() => changeEndTime(5)}
                  >
                    +5 min
                  </Button>
                  <Button
                    variant="filled"
                    disabled={slot.endTime === null}
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
      <Group justify="flex-end">
        <Text c="dimmed" size="xs" mt="sm">
          Last checked at: {formattedLastHeartbeat}
        </Text>
      </Group>
    </>
  );
}
