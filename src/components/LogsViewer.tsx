"use client";

import {
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
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LogEntry {
  id: number;
  timestamp: number;
  unit: string;
  message: string;
  priority: number;
}

const MAX_LINES = 1000;

interface UnitGroup {
  label: string;
  color: string;
  units: string[];
}

const UNIT_GROUPS: UnitGroup[] = [
  { label: "app", color: "cyan", units: ["moonclock-app.service"] },
  { label: "hw", color: "violet", units: ["moonclock-hardware.service"] },
  {
    label: "updater",
    color: "orange",
    units: [
      "moonclock-update-checker.timer",
      "moonclock-update-checker.service",
    ],
  },
];

const GROUP_BY_UNIT = new Map<string, UnitGroup>(
  UNIT_GROUPS.flatMap((g) => g.units.map((u) => [u, g] as const)),
);

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
  const [error, setError] = useState<string | null>(null);
  const [enabledGroups, setEnabledGroups] = useState<string[]>(
    UNIT_GROUPS.map((g) => g.label),
  );
  const [autoScroll, setAutoScroll] = useState(true);

  const idRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    autoScrollRef.current = autoScroll;
  }, [autoScroll]);

  useEffect(() => {
    const es = new EventSource("/api/logs/stream");

    es.onmessage = (e) => {
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
    () =>
      logs.filter((l) => {
        const group = GROUP_BY_UNIT.get(l.unit);
        return group ? enabledGroups.includes(group.label) : true;
      }),
    [logs, enabledGroups],
  );

  const handleScrollPositionChange = ({ y }: { x: number; y: number }) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const distanceFromBottom = vp.scrollHeight - vp.clientHeight - y;
    setAutoScroll(distanceFromBottom < 20);
  };

  return (
    <Stack h="calc(100vh - 100px)" gap="sm">
      <Title order={2}>Logs</Title>

      <Chip.Group
        multiple
        value={enabledGroups}
        onChange={(v) => setEnabledGroups(v as string[])}
      >
        <Group gap="xs">
          {UNIT_GROUPS.map((g) => (
            <Chip key={g.label} value={g.label} size="xs" color={g.color}>
              {g.label}
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
              visibleLogs.map((entry) => {
                const group = GROUP_BY_UNIT.get(entry.unit);
                return (
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
                      color={group?.color || "gray"}
                      variant="light"
                      style={{ flexShrink: 0, minWidth: 60 }}
                    >
                      {group?.label || entry.unit}
                    </Badge>
                    <Text
                      size="xs"
                      c={priorityColor(entry.priority)}
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {entry.message}
                    </Text>
                  </Group>
                );
              })
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
