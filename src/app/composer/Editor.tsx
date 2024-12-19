"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Display from "./display";
import { setSceneData } from "../server/actions";

function Color({
  color,
  setActiveColor,
  activeColor,
}: {
  color: string | null;
  setActiveColor: (color: string | null) => void;
  activeColor: string | null;
}) {
  return (
    <>
      <div
        style={{
          width: "20px",
          height: "20px",
          background: color || "#000",
          border: color === activeColor ? "2px solid red" : "none",
        }}
        onClick={() => setActiveColor(color)}
      ></div>
    </>
  );
}
function Palette({
  activeColor,
  setActiveColor,
  matrix,
}: {
  activeColor: string | null;
  setActiveColor: any;
  matrix: any;
}) {
  const [colors, setColors] = useState([
    null,
    "#800080",
    "#f4d0a9",
    "#facc0d",
    "#ffffff",
  ]);

  useEffect(() => {
    const matrixColors = new Set<string>();

    for (const coordinate in matrix) {
      matrixColors.add(matrix[coordinate]);
    }
    setColors([...(matrixColors.size === 0 ? colors : []), ...matrixColors]);
  }, [JSON.stringify(matrix)]);
  return (
    <div style={{ display: "flex", width: "100%" }}>
      {colors.map((color) => (
        <Color
          color={color}
          setActiveColor={setActiveColor}
          activeColor={activeColor}
          key={color}
        />
      ))}
      <form
        onSubmit={(ev: any) => {
          ev.preventDefault();
          setColors([...colors, ev.target.elements.new_color.value]);
        }}
      >
        <input type="color" name="new_color" />
        <input type="submit" value="add"></input>
      </form>
    </div>
  );
}

export function Editor({
  allSceneData,
}: {
  allSceneData: { name: string; coordinates: { [k: string]: string } }[];
}) {
  const scenes = allSceneData.map(({ name }) => name);

  const [scene, setScene] = useState(scenes[0]);

  const [activeColor, setActiveColor] = useState(null);
  const [matrix, setMatrix] = useState({});

  const [opened, { open, close }] = useDisclosure();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "" },
  });

  useEffect(() => {
    const selectedScene = allSceneData.find(({ name }) => name === scene);
    if (!selectedScene) return;
    setMatrix(selectedScene.coordinates);
  }, [scene, JSON.stringify(allSceneData[scene])]);

  return (
    <Stack>
      <Select
        placeholder="Select a scene..."
        variant="filled"
        style={{ flex: 1 }}
        value={scene}
        data={[
          { label: "New scene", value: "new-scene" },
          ...scenes?.map((scene: any) => ({
            label: scene,
            value: scene,
          })),
        ]}
        onChange={(value) => {
          if (value === "new-scene") {
            return open();
          }
          setScene(value as string);
        }}
      />
      <Modal title="New scene" opened={opened} onClose={close}>
        <form
          onSubmit={form.onSubmit(async ({ name }) => {
            await setSceneData(name, {});
            setScene(name);
            close();
          })}
        >
          <TextInput
            label="Scene Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>

      {matrix && scene && (
        <>
          <Flex>
            <Palette
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              matrix={matrix}
            />
            <Button
              onClick={() => {
                setSceneData(scene, matrix);
              }}
            >
              Save
            </Button>
          </Flex>
          <Display
            activeColor={activeColor}
            matrix={matrix}
            setMatrix={setMatrix}
          />
        </>
      )}
    </Stack>
  );
}
