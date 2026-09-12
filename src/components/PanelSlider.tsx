"use client";

import { Slider, Stack, Text } from "@mantine/core";
import { TunablePanelField } from "@/helpers/recommendedPanelSettings";

export interface PanelSliderSpec {
  field: TunablePanelField;
  label: string;
  description?: string;
  min: number;
  max: number;
  advanced: boolean;
  hideValueLabel?: boolean;
  testId?: string;
}

export const panelSliders: PanelSliderSpec[] = [
  {
    field: "brightness",
    testId: "brightness-slider",
    label: "Display Brightness",
    min: 0,
    max: 100,
    advanced: false,
    hideValueLabel: true,
  },
  {
    field: "pwnLsbNanoseconds",
    testId: "pwn-lsb-nanoseconds-slider",
    label: "LED PWN LSB nanoseconds",
    description:
      "Higher gives better color and less ghosting, at a lower frame rate.",
    min: 0,
    max: 1000,
    advanced: true,
  },
  {
    field: "gpioSlowdown",
    testId: "gpio-slowdown-slider",
    label: "GPIO Slowdown",
    description:
      "Faster Pis need a higher value; a Zero or Model B+ may want 0.",
    min: 0,
    max: 4,
    advanced: true,
  },
  {
    field: "pwmBits",
    testId: "pwm-bits-slider",
    label: "PWN Bits",
    description:
      "Lower trades color precision for a longer row pulse, which cuts ghosting.",
    min: 1,
    max: 11,
    advanced: true,
  },
  {
    field: "pwmDitherBits",
    label: "PWM Dither Bits",
    description: "Only has an effect at 11 PWM bits.",
    min: 0,
    max: 2,
    advanced: true,
    testId: "pwm-dither-bits-slider",
  },
  {
    field: "limitRefreshRateHz",
    label: "Limit Refresh Rate (Hz)",
    description:
      "Holds the rate steady under load. 0 means no limit; too low dims the panel.",
    min: 0,
    max: 300,
    advanced: true,
    testId: "limit-refresh-hz-slider",
  },
];

interface PanelSliderProps {
  spec: PanelSliderSpec;
  value: number | undefined;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  disabled?: boolean;
}

export function PanelSlider({
  spec,
  value,
  onChange,
  onChangeEnd,
  disabled,
}: PanelSliderProps) {
  return (
    <Stack gap={4}>
      <Stack gap={0}>
        <Text size="sm">{spec.label}</Text>
        {spec.description && (
          <Text c="dimmed" size="xs">
            {spec.description}
          </Text>
        )}
      </Stack>
      <Slider
        min={spec.min}
        max={spec.max}
        label={spec.hideValueLabel ? null : undefined}
        value={value ?? spec.min}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        disabled={disabled}
        data-testid={spec.testId}
      />
    </Stack>
  );
}
