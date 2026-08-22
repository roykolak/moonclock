"use client";

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconClock,
  IconExclamationCircleFilled,
  IconPencil,
  IconPlus,
  IconSettings,
  IconTerminal2,
} from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Panel as PanelType,
  Preset,
  ScheduledPreset,
  NextVersion,
} from "../types";
import Panel from "./Panel";
import { Settings } from "./Settings";
import { LogsViewer } from "./LogsViewer";
import { UpdatePrompt } from "./UpdatePrompt";
import { PresetForm } from "./PresetForm";
import { getEndDate } from "@/helpers/getEndDate";
import { updateScheduledPreset } from "@/server/actions/scheduledPreset";
import {
  createPreset,
  updatePreset,
  deletePreset,
} from "@/server/actions/presets";

const PANEL_WIDTH = 560;

interface MainScreenProps {
  panel: PanelType;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  formattedEndTime: string | null;
  nextVersion: NextVersion | null;
}

export default function MainScreen({
  panel,
  scheduledPreset,
  presets,
  formattedEndTime,
  nextVersion,
}: MainScreenProps) {
  const [settingsOpen, settingsHandlers] = useDisclosure();
  const [logsOpen, logsHandlers] = useDisclosure();
  const [createPresetOpen, createPresetHandlers] = useDisclosure();
  const [editPresetOpen, editPresetHandlers] = useDisclosure();

  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const activePreset = scheduledPreset?.preset ?? null;
  const isActivePreset = (preset: Preset) =>
    activePreset != null &&
    (activePreset.id != null && preset.id != null
      ? activePreset.id === preset.id
      : activePreset.name === preset.name);

  const clearPreset = () =>
    updateScheduledPreset({ preset: null, endTime: null });

  // Selecting the already-active preset unselects it, so the dropdown toggles.
  const togglePreset = (preset: Preset) => {
    if (isActivePreset(preset)) {
      clearPreset();
      return;
    }
    const endDate = getEndDate(preset);
    updateScheduledPreset({
      preset,
      endTime: endDate?.toJSON() || null,
    });
  };

  const openEditPreset = (preset: Preset) => {
    setPresetMenuOpen(false);
    setEditingPreset(preset);
    editPresetHandlers.open();
  };

  const presetControl = (
    <Menu
      opened={presetMenuOpen}
      onChange={setPresetMenuOpen}
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
          return (
            <Group key={`preset-${i}`} wrap="nowrap" gap={0} pr={4}>
              <Menu.Item
                onClick={() => togglePreset(preset)}
                style={{ flex: 1 }}
                fw={active ? 600 : undefined}
                leftSection={
                  <IconCheck size={16} style={{ opacity: active ? 1 : 0 }} />
                }
              >
                {preset.name}
              </Menu.Item>
              <ActionIcon
                variant="subtle"
                color="gray"
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
          onClick={createPresetHandlers.open}
        >
          Create new preset
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <Box
      style={{
        minHeight: "100vh",
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
      >
        <LogsViewer />
      </Modal>

      <Modal
        opened={editPresetOpen}
        onClose={editPresetHandlers.close}
        title="Edit Preset"
        size="lg"
      >
        {editingPreset && (
          <>
            <PresetForm
              preset={editingPreset}
              action={async (preset) => {
                updatePreset(preset);
                editPresetHandlers.close();
              }}
              submitLabel="Update Preset"
            />
            <Button
              color="red"
              variant="outline"
              fullWidth
              mt="xl"
              onClick={() => {
                if (!editingPreset.id) return;
                editPresetHandlers.close();
                deletePreset(editingPreset.id);
              }}
            >
              Delete Preset
            </Button>
          </>
        )}
      </Modal>

      <Modal
        opened={createPresetOpen}
        onClose={createPresetHandlers.close}
        title="Create New Preset"
        size="lg"
      >
        <PresetForm
          preset={null}
          action={async (preset) => {
            createPreset(preset);
            createPresetHandlers.close();
          }}
          submitLabel="Create Preset"
        />
      </Modal>
    </Box>
  );
}
