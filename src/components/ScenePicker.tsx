"use client";

import { Card, SimpleGrid, Text, UnstyledButton } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { scenes } from "@/scenes/catalog";
import { Preset } from "@/types";
import { PresetPreview } from "./PresetPreview";

export function ScenePicker({ form }: { form: UseFormReturnType<Preset> }) {
  const selected = form.getValues().sceneId;

  return (
    <SimpleGrid cols={3} data-testid="scene-picker" role="radiogroup">
      {scenes.map((scene) => (
        <UnstyledButton
          key={scene.id}
          role="radio"
          aria-checked={selected === scene.id}
          data-testid={`scene-option-${scene.id}`}
          onClick={() => form.setFieldValue("sceneId", scene.id)}
        >
          <Card
            p={4}
            withBorder
            style={{
              borderColor:
                selected === scene.id
                  ? "var(--mantine-color-blue-5)"
                  : undefined,
              borderWidth: selected === scene.id ? 2 : 1,
            }}
          >
            <PresetPreview
              preset={{ ...form.getValues(), sceneId: scene.id }}
              staticFrame
            />
            <Text size="xs" ta="center" mt={4}>
              {scene.label}
            </Text>
          </Card>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}
