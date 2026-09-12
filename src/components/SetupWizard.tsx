"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Group,
  Loader,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconArrowLeft, IconInfoCircle, IconWand } from "@tabler/icons-react";
import { DeviceApi } from "@/client/deviceApi";
import { Panel } from "@/types";
import { recommendedPanelSettings } from "@/helpers/recommendedPanelSettings";
import { panelSliders, PanelSlider } from "./PanelSlider";

const tuningSliders = panelSliders.filter((spec) => spec.advanced);

const recommendedTuning = Object.fromEntries(
  tuningSliders.map((spec) => [
    spec.field,
    recommendedPanelSettings[spec.field],
  ]),
) as Partial<Panel>;

const SOLDERED_MAPPING = "adafruit-hat-pwm";
const UNSOLDERED_MAPPING = "adafruit-hat";

const LEASE_MS = 30000;
const RENEW_MS = 10000;
const RESTART_SETTLE_MS = 4000;

interface SetupWizardProps {
  panel: Panel;
  api: DeviceApi;
  onSaved: () => Promise<void>;
  onFinish: () => Promise<void>;
}

export function SetupWizard({
  panel,
  api,
  onSaved,
  onFinish,
}: SetupWizardProps) {
  const [step, setStep] = useState<"jumper" | "tuning">("jumper");
  const [values, setValues] = useState<Panel>(panel);
  const [soldered, setSoldered] = useState(
    panel.hardwareMapping === SOLDERED_MAPPING ? "yes" : "no",
  );
  const [restarting, setRestarting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const restartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    return () => {
      if (restartTimer.current) clearTimeout(restartTimer.current);
    };
  }, []);

  const savePanel = useCallback(
    async (changes: Partial<Panel>) => {
      const next = { ...values, ...changes } as Panel;
      setValues(next);

      setRestarting(true);
      if (restartTimer.current) clearTimeout(restartTimer.current);

      try {
        await api.updatePanel(next);
        await onSaved();
      } catch {
        showNotification({
          message: "Couldn't save that — the clock didn't answer",
          color: "red",
        });
      }

      restartTimer.current = setTimeout(
        () => setRestarting(false),
        RESTART_SETTLE_MS,
      );
    },
    [api, onSaved, values],
  );

  useEffect(() => {
    if (step !== "tuning") return;

    let live = true;

    const renew = () => {
      if (!live || finished.current) return;
      api
        .updateSetup({
          testPatternUntil: new Date(Date.now() + LEASE_MS).toJSON(),
        })
        .catch(() => {});
    };

    renew();
    const interval = setInterval(renew, RENEW_MS);

    return () => {
      live = false;
      clearInterval(interval);
      if (finished.current) return;
      api.updateSetup({ testPatternUntil: null }).catch(() => {});
    };
  }, [api, step]);

  if (step === "jumper") {
    return (
      <Stack
        gap={0}
        style={{ flex: 1, minHeight: 0 }}
        data-testid="setup-jumper-step"
      >
        <Stack
          gap="md"
          pb="md"
          style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
        >
          <Title order={4}>Did you solder the jumper wire?</Title>

          <Radio.Group
            value={soldered}
            onChange={setSoldered}
            data-testid="soldered-choice"
          >
            <Stack gap="xs">
              <Radio.Card p="md" radius="md" value="yes">
                <Group wrap="nowrap" align="flex-start">
                  <Radio.Indicator />
                  <Box>
                    <Text size="sm" fw={500}>
                      Yes — GPIO 4 and 18 are bridged (recommended)
                    </Text>
                    <Text size="xs" c="dimmed">
                      Uses the Adafruit HAT (PWM) mapping, with hardware-pulsed
                      Output Enable.
                    </Text>
                  </Box>
                </Group>
              </Radio.Card>
              <Radio.Card p="md" radius="md" value="no">
                <Group wrap="nowrap" align="flex-start">
                  <Radio.Indicator />
                  <Box>
                    <Text size="sm" fw={500}>
                      No — the HAT is untouched
                    </Text>
                    <Text size="xs" c="dimmed">
                      Uses the plain Adafruit HAT mapping. It works, with more
                      ghosting to tune out.
                    </Text>
                  </Box>
                </Group>
              </Radio.Card>
            </Stack>
          </Radio.Group>
        </Stack>

        <Box
          pt="md"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Button
            fullWidth
            data-testid="setup-continue"
            onClick={async () => {
              await savePanel({
                hardwareMapping:
                  soldered === "yes" ? SOLDERED_MAPPING : UNSOLDERED_MAPPING,
              });
              setStep("tuning");
            }}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      gap={0}
      style={{ flex: 1, minHeight: 0 }}
      data-testid="setup-tuning-step"
    >
      <Stack
        gap="sm"
        pb="md"
        style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
      >
        <Alert
          variant="light"
          color="blue"
          p="xs"
          icon={<IconInfoCircle size={18} stroke={1.5} />}
        >
          <Text size="xs">
            Tune your display, try to minimize greenish ghosting.
          </Text>
        </Alert>

        <Button
          variant="default"
          size="xs"
          leftSection={<IconWand size={14} stroke={1.5} />}
          data-testid="use-recommended-settings"
          onClick={() => savePanel(recommendedTuning)}
        >
          Use recommended settings
        </Button>

        <Group gap="xs" h={18} justify="center">
          {restarting && (
            <>
              <Loader size="xs" />
              <Text size="xs" c="dimmed" data-testid="setup-restarting">
                Restarting the display...
              </Text>
            </>
          )}
        </Group>

        <Stack gap="md">
          {tuningSliders.map((spec) => (
            <PanelSlider
              key={spec.field}
              spec={spec}
              value={values[spec.field]}
              onChange={(value) =>
                setValues((current) => ({ ...current, [spec.field]: value }))
              }
              onChangeEnd={(value) => savePanel({ [spec.field]: value })}
            />
          ))}
        </Stack>
      </Stack>

      <Group
        justify="space-between"
        pt="md"
        style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
      >
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} stroke={1.5} />}
          onClick={() => setStep("jumper")}
        >
          Back
        </Button>
        <Button
          data-testid="finish-setup"
          loading={finishing}
          onClick={async () => {
            finished.current = true;
            setFinishing(true);
            try {
              await onFinish();
            } finally {
              setFinishing(false);
            }
          }}
        >
          Finish setup
        </Button>
      </Group>
    </Stack>
  );
}
