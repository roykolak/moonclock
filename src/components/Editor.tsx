"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { TouchDisplay } from "./TouchDisplay";
import { updateCustomSceneData } from "@/server/actions";
import { CustomScene } from "@/types";

function Color({
  color,
  setActiveColor,
  activeColor,
  index,
}: {
  color: string | null;
  setActiveColor: (color: string | null) => void;
  activeColor: string | null;
  index: number;
}) {
  return (
    <>
      <div
        style={{
          width: "25px",
          height: "25px",
          background: color || "#000",
          border: color === activeColor ? "2px solid red" : "none",
        }}
        data-testid={`color-${index}`}
        onClick={() => setActiveColor(color)}
      ></div>
    </>
  );
}

const defaultColors = ["#89CFF0", "#facc0d"];

function Palette({
  activeColor,
  setActiveColor,
  matrix,
}: {
  activeColor: string | null;
  setActiveColor: any;
  matrix: any;
}) {
  const [colors, setColors] = useState(defaultColors);

  useEffect(() => {
    const matrixColors = new Set<string>();

    for (const coordinate in matrix) {
      matrixColors.add(matrix[coordinate]);
    }

    setColors([...defaultColors, ...matrixColors]);
  }, [JSON.stringify(matrix)]);

  return (
    <Group justify="space-between" w="100%">
      <Group gap={0}>
        {colors.map((color, i) => (
          <Color
            color={color}
            setActiveColor={setActiveColor}
            activeColor={activeColor}
            key={color}
            index={i}
          />
        ))}
      </Group>
      <form
        onSubmit={(ev: any) => {
          ev.preventDefault();
          setColors([...colors, ev.target.elements.new_color.value]);
        }}
      >
        <Group gap="xs">
          <input type="color" name="new_color" />
          <Button type="submit" size="compact-sm" variant="light">
            Add
          </Button>
        </Group>
      </form>
    </Group>
  );
}

export function Editor({ customScenes }: { customScenes: CustomScene[] }) {
  const [selectedScene, setSelectedScene] = useState(customScenes[0]);
  const [showGrid, setShowGrid] = useState(false);

  const [activeColor, setActiveColor] = useState(null);
  const [matrix, setMatrix] = useState({});

  const [opened, { open, close }] = useDisclosure();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "" },
  });

  useEffect(() => {
    if (!selectedScene) return;
    setMatrix(selectedScene.coordinates);
  }, [selectedScene]);

  return (
    <Stack>
      <Select
        placeholder="Select a scene..."
        variant="filled"
        style={{ flex: 1 }}
        value={selectedScene?.name}
        data-testid="edit-scene-select"
        data={[
          { label: "New scene", value: "new-scene" },
          ...customScenes?.map(({ name }) => ({
            label: name,
            value: name,
          })),
        ]}
        onChange={(value) => {
          if (value === "new-scene") {
            return open();
          }

          const newSelectedScene = customScenes.find(
            ({ name }) => name === value
          );

          if (newSelectedScene) {
            setSelectedScene(newSelectedScene);
          }
        }}
      />
      <Modal title="New scene" opened={opened} onClose={close}>
        <form
          onSubmit={form.onSubmit(async ({ name }) => {
            const newScene = { name, coordinates: {} };
            await updateCustomSceneData(newScene);
            setSelectedScene(newScene);
            close();
          })}
        >
          <TextInput
            label="Scene Name"
            data-testid="new-scene-name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>

      {matrix && selectedScene && (
        <Stack>
          <Palette
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            matrix={matrix}
          />
          <TouchDisplay
            activeColor={activeColor}
            matrix={matrix}
            setMatrix={setMatrix}
            showGrid={showGrid}
          />
          <Checkbox
            checked={showGrid}
            onChange={() => setShowGrid((v) => !v)}
            label="Show grid lines"
          ></Checkbox>
          <Button
            onClick={() => {
              updateCustomSceneData({
                name: selectedScene.name,
                coordinates: matrix,
              });
            }}
          >
            Save Scene
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
