"use client";

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Menu,
  Modal,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconClock,
  IconExclamationCircleFilled,
  IconPencil,
  IconPlus,
  IconSettings,
  IconTerminal2,
  IconTrash,
} from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";
import { Device, DeviceState, Preset } from "../types";
import { DeviceApi } from "@/client/deviceApi";
import Panel from "./Panel";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { Settings } from "./Settings";
import { LogsViewer } from "./LogsViewer";
import { UpdatePrompt } from "./UpdatePrompt";
import { PresetForm } from "./PresetForm";
import { getEndDate } from "@/helpers/getEndDate";
import { useDeviceState } from "./useDeviceState";

const PANEL_WIDTH = 560;
const NARROW_VIEWPORT = "(max-width: 48em)";

interface DeviceScreenProps {
  api: DeviceApi;
  initialState: DeviceState | null;
  localName: string;
  localDeviceId: string;
  selectedDeviceId: string;
  peers: Device[];
  onSelectDevice: (deviceId: string) => void;
  onLocalNameChange: (name: string) => void;
}

export default function DeviceScreen({
  api,
  initialState,
  localName,
  localDeviceId,
  selectedDeviceId,
  peers,
  onSelectDevice,
  onLocalNameChange,
}: DeviceScreenProps) {
  const { state, refresh, unreachable } = useDeviceState(api, initialState);

  const narrowViewport = useMediaQuery(NARROW_VIEWPORT);

  const [settingsOpen, settingsHandlers] = useDisclosure();
  const [logsOpen, logsHandlers] = useDisclosure();
  const [createPresetOpen, createPresetHandlers] = useDisclosure();
  const [editPresetOpen, editPresetHandlers] = useDisclosure();

  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<Preset | null>(null);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const scheduledPreset = state?.scheduledPreset ?? null;
  const activePreset = scheduledPreset?.preset ?? null;

  const [formattedEndTime, setFormattedEndTime] = useState<string | null>(null);

  useEffect(() => {
    if (!scheduledPreset) return setFormattedEndTime(null);

    setFormattedEndTime(
      scheduledPreset.endTime
        ? new Date(scheduledPreset.endTime).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "forever",
    );
  }, [scheduledPreset]);

  const currentName = state?.panel.name;

  useEffect(() => {
    if (!currentName) return;

    document.title = currentName;
    if (api.isLocal) onLocalNameChange(currentName);
  }, [api.isLocal, currentName, onLocalNameChange]);

  if (!state) {
    return (
      <Center mih="100dvh" p="xl">
        {unreachable ? (
          <Alert
            title="Can't reach that clock"
            color="red"
            icon={<IconExclamationCircleFilled />}
          >
            <Text size="sm">
              It may be restarting or have left the network.
            </Text>
            <Button
              mt="md"
              size="xs"
              variant="light"
              onClick={() => onSelectDevice(localDeviceId)}
            >
              Back to this clock
            </Button>
          </Alert>
        ) : (
          <Loader />
        )}
      </Center>
    );
  }

  const { panel, presets, nextVersion, version } = state;

  const nameControl =
    peers.length > 0 ? (
      <DeviceSwitcher
        name={panel.name}
        localName={localName}
        localDeviceId={localDeviceId}
        selectedDeviceId={selectedDeviceId}
        peers={peers}
        onSelect={onSelectDevice}
      />
    ) : undefined;

  const samePreset = (a: Preset | null, b: Preset | null) =>
    a != null &&
    b != null &&
    (a.id != null && b.id != null ? a.id === b.id : a.name === b.name);

  const isActivePreset = (preset: Preset) => samePreset(activePreset, preset);

  const applyScheduledPreset = async (
    preset: Preset | null,
    endTime: string | null,
  ) => {
    await api.setScheduledPreset({ preset, endTime });
    await refresh();
  };

  // Selecting the already-active preset unselects it, so the dropdown toggles.
  const togglePreset = async (preset: Preset) => {
    if (pendingPreset) return;

    const clearing = isActivePreset(preset);
    setPendingPreset(preset);

    try {
      if (clearing) {
        await applyScheduledPreset(null, null);
      } else {
        await applyScheduledPreset(
          preset,
          getEndDate(preset)?.toJSON() || null,
        );
      }
    } catch {
      showNotification({
        message: clearing
          ? `Couldn't turn off ${preset.name}`
          : `Couldn't switch to ${preset.name}`,
        color: "red",
      });
    } finally {
      setPendingPreset(null);
      setPresetMenuOpen(false);
    }
  };

  const openEditPreset = (preset: Preset) => {
    setPresetMenuOpen(false);
    setEditingPreset(preset);
    setDeleteConfirmOpen(false);
    editPresetHandlers.open();
  };

  const closeEditPreset = () => {
    setDeleteConfirmOpen(false);
    editPresetHandlers.close();
  };

  const deleteEditingPreset = async () => {
    if (!editingPreset?.id) return;
    closeEditPreset();
    await api.deletePreset(editingPreset.id);
    await refresh();
  };

  const presetControl = (
    <Menu
      opened={presetMenuOpen}
      onChange={setPresetMenuOpen}
      closeOnItemClick={false}
      withinPortal
      position="bottom-end"
      shadow="sm"
    >
      <Menu.Target>
        <Button
          variant="light"
          color="gray"
          size="xs"
          h={28}
          rightSection={<IconChevronDown size={16} />}
          data-testid="preset-dropdown"
        >
          {activePreset?.name ?? "Blank"}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Apply a preset</Menu.Label>
        {presets.map((preset, i) => {
          const active = isActivePreset(preset);
          const pending = samePreset(pendingPreset, preset);
          return (
            <Group key={`preset-${i}`} wrap="nowrap" gap={0} pr={4}>
              <Menu.Item
                onClick={() => togglePreset(preset)}
                disabled={pendingPreset != null && !pending}
                style={{ flex: 1 }}
                fw={active ? 600 : undefined}
                data-testid={pending ? "pending-preset" : undefined}
                leftSection={
                  pending ? (
                    <Loader size={16} />
                  ) : (
                    <IconCheck size={16} style={{ opacity: active ? 1 : 0 }} />
                  )
                }
              >
                {preset.name}
              </Menu.Item>
              <ActionIcon
                variant="subtle"
                color="gray"
                disabled={pendingPreset != null}
                aria-label={`Edit ${preset.name}`}
                onClick={() => openEditPreset(preset)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Group>
          );
        })}
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconPlus size={16} />}
          disabled={pendingPreset != null}
          onClick={() => {
            setPresetMenuOpen(false);
            createPresetHandlers.open();
          }}
        >
          Create new preset
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <Box
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 24px",
      }}
    >
      <Box
        style={{
          position: "relative",
          width: "100%",
          maxWidth: PANEL_WIDTH,
        }}
      >
        {unreachable && (
          <Alert color="yellow" variant="light" mb="sm" py={6}>
            <Text size="xs">Lost contact with {panel.name} — retrying...</Text>
          </Alert>
        )}

        {/* The panel itself */}
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
          <Panel
            panel={panel}
            scheduledPreset={scheduledPreset}
            api={api}
            onRefresh={refresh}
            nameControl={nameControl}
            headerAction={presetControl}
          />
        </ErrorBoundary>

        {/* Controls row beneath the panel */}
        <Group justify="space-between" align="center" mt="md" px={4}>
          <Group gap="xs">
            <Tooltip label="Settings">
              <ActionIcon
                variant="default"
                color="gray"
                size="lg"
                radius="xl"
                onClick={settingsHandlers.open}
                data-testid="open-settings"
              >
                <IconSettings size={22} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Logs">
              <ActionIcon
                variant="default"
                color="gray"
                size="lg"
                radius="xl"
                onClick={logsHandlers.open}
                data-testid="open-logs"
              >
                <IconTerminal2 size={22} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <UpdatePrompt
              nextVersion={nextVersion}
              api={api}
              onFinished={() => {
                if (api.isLocal) {
                  window.location.reload();
                } else {
                  refresh();
                }
              }}
              releaseNotesOpen={releaseNotesOpen}
              onReleaseNotesOpenChange={setReleaseNotesOpen}
            />
          </Group>

          {activePreset && formattedEndTime && (
            <Group gap={6} align="center" c="dimmed" data-testid="end-time">
              <IconClock size={16} stroke={1.5} />
              <Text size="sm">Until {formattedEndTime}</Text>
            </Group>
          )}
        </Group>
      </Box>

      {/* Modals */}
      <Modal
        opened={settingsOpen}
        onClose={settingsHandlers.close}
        title="Settings"
        size="lg"
      >
        <Settings
          panel={panel}
          version={version}
          api={api}
          onSaved={refresh}
          onUpdateAvailable={() => {
            settingsHandlers.close();
            setReleaseNotesOpen(true);
          }}
        />
      </Modal>

      <Modal
        opened={logsOpen}
        onClose={logsHandlers.close}
        title="Logs"
        size="xl"
        fullScreen={narrowViewport}
        padding={narrowViewport ? "xs" : "md"}
        styles={{
          // LogsViewer scrolls its own list, so the modal must not scroll too —
          // otherwise a long log run leaves you with two nested scrollbars. Pin
          // the modal to a definite height and let the body fill what's left of
          // it without overflowing, which is what gives the viewer inside a real
          // height to measure against.
          content: {
            height: narrowViewport ? "100dvh" : "calc(100dvh - 100px)",
            display: "flex",
            flexDirection: "column",
          },
          body: { flex: 1, minHeight: 0, overflow: "hidden" },
        }}
      >
        <LogsViewer
          streamUrl={api.logsStreamUrl}
          narrowViewport={narrowViewport}
        />
      </Modal>

      <Modal.Root
        opened={editPresetOpen}
        onClose={closeEditPreset}
        size="lg"
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Preset</Modal.Title>
            <Group gap={4} wrap="nowrap">
              {editingPreset?.id && (
                <Popover
                  opened={deleteConfirmOpen}
                  onChange={setDeleteConfirmOpen}
                  position="bottom-end"
                  width={260}
                  shadow="md"
                  withArrow
                  withinPortal
                >
                  <Popover.Target>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      c="red.5"
                      radius="xl"
                      aria-label="Delete preset"
                      data-testid="delete-preset"
                      onClick={() => setDeleteConfirmOpen((open) => !open)}
                    >
                      <IconTrash size={18} stroke={1.5} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text size="sm">
                      Delete {editingPreset.name}? This can&apos;t be undone.
                    </Text>
                    <Group justify="flex-end" gap="xs" mt="sm">
                      <Button
                        size="xs"
                        variant="default"
                        onClick={() => setDeleteConfirmOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        onClick={deleteEditingPreset}
                        data-testid="confirm-delete-preset"
                      >
                        Delete
                      </Button>
                    </Group>
                  </Popover.Dropdown>
                </Popover>
              )}
              <Modal.CloseButton />
            </Group>
          </Modal.Header>
          <Modal.Body>
            {editingPreset && (
              <PresetForm
                preset={editingPreset}
                action={async (preset) => {
                  closeEditPreset();
                  await api.updatePreset({ ...preset, id: editingPreset.id });
                  await refresh();
                }}
                submitLabel="Update Preset"
              />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Modal
        opened={createPresetOpen}
        onClose={createPresetHandlers.close}
        title="Create New Preset"
        size="lg"
      >
        <PresetForm
          preset={null}
          action={async (preset) => {
            createPresetHandlers.close();
            await api.createPreset(preset);
            await refresh();
          }}
          submitLabel="Create Preset"
        />
      </Modal>
    </Box>
  );
}
