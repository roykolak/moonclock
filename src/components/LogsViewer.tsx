"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LogEntry {
  id: number;
  timestamp: number;
  unit: string;
  message: string;
  priority: number;
}

const MAX_LINES = 1000;

const UNIT_COLORS: Record<string, string> = {
  "moonclock-app.service": "cyan",
  "moonclock-hardware.service": "violet",
  "moonclock-update-checker.timer": "orange",
  "moonclock-update-checker.service": "orange",
};

const UNIT_SHORT: Record<string, string> = {
  "moonclock-app.service": "app",
  "moonclock-hardware.service": "hw",
  "moonclock-update-checker.timer": "updater",
  "moonclock-update-checker.service": "updater",
};

function priorityColor(priority: number): string | undefined {
  if (priority <= 3) return "red";
  if (priority === 4) return "yellow";
  if (priority === 7) return "dimmed";
  return undefined;
}

function formatTime(microseconds: number): string {
  const d = new Date(microseconds / 1000);
  return d.toLocaleTimeString([], { hour12: false });
}

export function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabledUnits, setEnabledUnits] = useState<string[]>(
    Object.keys(UNIT_COLORS),
  );
  const [autoScroll, setAutoScroll] = useState(true);

  const idRef = useRef(0);
  const pausedRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    autoScrollRef.current = autoScroll;
  }, [autoScroll]);

  useEffect(() => {
    const es = new EventSource("/api/logs/stream");

    es.onmessage = (e) => {
      if (pausedRef.current) return;
      try {
        const raw = JSON.parse(e.data);
        const entry: LogEntry = {
          id: idRef.current++,
          timestamp: Number(raw.__REALTIME_TIMESTAMP) || Date.now() * 1000,
          unit: raw._SYSTEMD_UNIT || raw.UNIT || "unknown",
          message: raw.MESSAGE ?? "",
          priority: Number(raw.PRIORITY ?? 6),
        };
        setLogs((prev) => {
          const next = [...prev, entry];
          if (next.length > MAX_LINES) next.splice(0, next.length - MAX_LINES);
          return next;
        });
      } catch {
        /* ignore malformed line */
      }
    };

    es.addEventListener("error", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setError(data.message || "Stream error");
      } catch {
        setError("Disconnected from log stream. Retrying...");
      }
    });

    return () => es.close();
  }, []);

  useEffect(() => {
    if (!autoScrollRef.current) return;
    const vp = viewportRef.current;
    if (!vp) return;
    vp.scrollTop = vp.scrollHeight;
  }, [logs]);

  const visibleLogs = useMemo(
    () => logs.filter((l) => enabledUnits.includes(l.unit)),
    [logs, enabledUnits],
  );

  const handleScrollPositionChange = ({ y }: { x: number; y: number }) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const distanceFromBottom = vp.scrollHeight - vp.clientHeight - y;
    setAutoScroll(distanceFromBottom < 20);
  };

  return (
    <Stack h="calc(100vh - 100px)" gap="sm">
      <Group justify="space-between" align="center">
        <Title order={2}>Logs</Title>
        <Group gap="xs">
          <Button
            size="xs"
            variant="default"
            leftSection={
              paused ? (
                <IconPlayerPlay size={14} />
              ) : (
                <IconPlayerPause size={14} />
              )
            }
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Resume" : "Pause"}
          </Button>
          <ActionIcon
            variant="default"
            size="md"
            onClick={() => setLogs([])}
            aria-label="Clear logs"
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Group>

      <Chip.Group
        multiple
        value={enabledUnits}
        onChange={(v) => setEnabledUnits(v as string[])}
      >
        <Group gap="xs">
          {Object.keys(UNIT_COLORS).map((u) => (
            <Chip key={u} value={u} size="xs" color={UNIT_COLORS[u]}>
              {UNIT_SHORT[u]}
            </Chip>
          ))}
        </Group>
      </Chip.Group>

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} variant="light">
          {error}
        </Alert>
      )}

      <Box
        style={{
          flex: 1,
          minHeight: 0,
          border: "1px solid var(--mantine-color-dark-4)",
          borderRadius: "var(--mantine-radius-sm)",
          position: "relative",
        }}
      >
        <ScrollArea
          h="100%"
          viewportRef={viewportRef}
          onScrollPositionChange={handleScrollPositionChange}
          type="auto"
        >
          <Box p="xs" style={{ fontFamily: "monospace", fontSize: 12 }}>
            {visibleLogs.length === 0 ? (
              <Text c="dimmed" size="sm">
                Waiting for logs...
              </Text>
            ) : (
              visibleLogs.map((entry) => (
                <Group
                  key={entry.id}
                  gap="xs"
                  wrap="nowrap"
                  align="flex-start"
                  style={{ lineHeight: 1.4 }}
                >
                  <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                    {formatTime(entry.timestamp)}
                  </Text>
                  <Badge
                    size="xs"
                    color={UNIT_COLORS[entry.unit] || "gray"}
                    variant="light"
                    style={{ flexShrink: 0, minWidth: 60 }}
                  >
                    {UNIT_SHORT[entry.unit] || entry.unit}
                  </Badge>
                  <Text
                    size="xs"
                    c={priorityColor(entry.priority)}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {entry.message}
                  </Text>
                </Group>
              ))
            )}
          </Box>
        </ScrollArea>

        {!autoScroll && (
          <Button
            size="xs"
            variant="filled"
            style={{
              position: "absolute",
              bottom: 8,
              right: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
            onClick={() => {
              const vp = viewportRef.current;
              if (vp) vp.scrollTop = vp.scrollHeight;
              setAutoScroll(true);
            }}
          >
            Resume autoscroll
          </Button>
        )}
      </Box>
    </Stack>
  );
}
