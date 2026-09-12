"use client";

import { DeviceApi } from "@/client/deviceApi";
import { Panel } from "@/types";
import {
  Accordion,
  Alert,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { panelSliders, PanelSlider } from "./PanelSlider";

const basicSliders = panelSliders.filter((spec) => !spec.advanced);

interface SettingsProps {
  panel: Panel;
  version: string;
  api: DeviceApi;
  onSaved: () => void;
  onUpdateAvailable: () => void;
}

export function Settings({
  panel,
  version,
  api,
  onSaved,
  onUpdateAvailable,
}: SettingsProps) {
  const form = useForm<Panel>({
    initialValues: {
      ...panel,
      updateChannel: panel.updateChannel ?? "stable",
      pwmDitherBits: panel.pwmDitherBits ?? 0,
      limitRefreshRateHz: panel.limitRefreshRateHz ?? 0,
      panelType: panel.panelType ?? "",
    },
  });

  const [checkingForUpdate, setCheckingForUpdate] = useState(false);
  const [resetConfirmOpen, resetConfirmHandlers] = useDisclosure();
  const [resetting, setResetting] = useState(false);

  const handleCheckForUpdate = async () => {
    setCheckingForUpdate(true);
    try {
      const data = await api.checkForUpdate();
      if (data.available) {
        onSaved();
        onUpdateAvailable();
      } else if (data.message?.includes("Error")) {
        showNotification({ message: data.message, color: "red" });
      } else {
        showNotification({ message: "You're up to date!" });
      }
    } catch {
      showNotification({ message: "Failed to check for update", color: "red" });
    } finally {
      setCheckingForUpdate(false);
    }
  };

  const handleResetDatabase = async () => {
    setResetting(true);
    try {
      await api.resetDatabase();
      window.location.reload();
    } catch {
      setResetting(false);
      resetConfirmHandlers.close();
      showNotification({
        message: "Failed to erase this clock",
        color: "red",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await api.updatePanel(values);
          onSaved();
          showNotification({ message: "Successfully updated settings!" });
        })}
        data-testid="preset-form"
      >
        <Stack>
          <TextInput
            placeholder=""
            variant="filled"
            style={{ flex: 1 }}
            label="Name"
            required
            data-testid="panel-name-input"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <Divider />

          <Title order={5} mt="md">
            Updates
          </Title>

          <Select
            variant="filled"
            style={{ flex: 1 }}
            label="Release channel"
            data={[
              { label: "Stable", value: "stable" },
              { label: "Beta", value: "beta" },
            ]}
            allowDeselect={false}
            data-testid="update-channel-select"
            key={form.key("updateChannel")}
            {...form.getInputProps("updateChannel")}
          />

          <Group justify="space-between" align="center">
            <Text c="dimmed" size="sm">
              v{version}
            </Text>
            <Button
              size="xs"
              variant="default"
              leftSection={<IconRefresh size={16} stroke={1.5} />}
              onClick={handleCheckForUpdate}
              loading={checkingForUpdate}
              data-testid="check-for-update-button"
            >
              Check for updates
            </Button>
          </Group>

          <Divider />

          <Title order={5} mt="md">
            Hardware Settings
          </Title>

          {basicSliders.map((spec) => {
            const { value, onChange } = form.getInputProps(spec.field);
            return (
              <PanelSlider
                key={spec.field}
                spec={spec}
                value={value as number | undefined}
                onChange={onChange}
              />
            );
          })}

          <Button type="submit" fullWidth mt="md">
            Save
          </Button>

          <Divider mt="xl" />

          <Accordion variant="separated">
            <Accordion.Item key="danger" value="danger">
              <Accordion.Control>
                <Text size="sm" c="red">
                  Danger Zone
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  align={{ base: "stretch", sm: "flex-start" }}
                  justify="space-between"
                  gap="sm"
                >
                  <Text c="dimmed" size="xs">
                    Erasing deletes this clock&apos;s database file — its name,
                    every preset, what it&apos;s showing now, and all of your
                    hardware tuning — and starts it over on the factory
                    defaults. It can&apos;t be undone.
                  </Text>
                  <Button
                    type="button"
                    color="red"
                    variant="outline"
                    size="xs"
                    style={{ flexShrink: 0 }}
                    leftSection={<IconTrash size={16} stroke={1.5} />}
                    onClick={resetConfirmHandlers.open}
                    data-testid="erase-clock-button"
                  >
                    Erase this clock
                  </Button>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </form>

      <Modal
        opened={resetConfirmOpen}
        onClose={resetConfirmHandlers.close}
        title="Erase this clock?"
        centered
      >
        <Stack>
          <Alert
            color="red"
            variant="light"
            icon={<IconAlertTriangle size={20} stroke={1.5} />}
          >
            <Text size="sm">
              {panel.name}&apos;s database file will be deleted and replaced
              with a factory-fresh one. Its presets, schedule, name, and
              hardware tuning all go with it, and the panel restarts on the
              defaults.
            </Text>
          </Alert>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={resetConfirmHandlers.close}
              disabled={resetting}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleResetDatabase}
              loading={resetting}
              data-testid="confirm-erase-clock-button"
            >
              Erase everything
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
