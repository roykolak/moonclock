"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  Stack,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { TouchDisplay } from "./TouchDisplay";
import { updateCustomSceneData } from "@/server/actions/customScenes";
import { generatePixelArt } from "@/server/actions/generatePixelArt";
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
            key={`${i}-${color}`}
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
  const [rawMatrix, setRawMatrix] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const [opened, { open, close }] = useDisclosure();
  const [aiModalOpened, { open: openAiModal, close: closeAiModal }] =
    useDisclosure();

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

      <Modal
        title="AI Generate Pixel Art"
        opened={aiModalOpened}
        onClose={() => {
          if (!isGenerating) {
            closeAiModal();
            setAiDescription("");
            setGenerationError("");
          }
        }}
        closeOnClickOutside={!isGenerating}
        closeOnEscape={!isGenerating}
        withCloseButton={!isGenerating}
      >
        <Stack>
          <Textarea
            placeholder="Describe the pixel art you want to generate... (e.g., 'a blue moon with yellow stars', 'a red heart', 'a green tree')"
            value={aiDescription}
            onChange={(event) => setAiDescription(event.currentTarget.value)}
            rows={4}
            data-testid="ai-description-input"
            disabled={isGenerating}
          />
          {generationError && (
            <Alert variant="light" color="red">
              {generationError}
            </Alert>
          )}
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                closeAiModal();
                setAiDescription("");
                setGenerationError("");
              }}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              loading={isGenerating}
              onClick={async () => {
                setIsGenerating(true);
                setGenerationError("");
                try {
                  const result = await generatePixelArt(aiDescription);
                  if (result.success && result.coordinates) {
                    setMatrix(result.coordinates);
                    closeAiModal();
                    setAiDescription("");
                  } else {
                    setGenerationError(
                      result.error || "Failed to generate pixel art"
                    );
                  }
                } catch (error) {
                  console.log(error);
                  setGenerationError("An unexpected error occurred");
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={!aiDescription.trim() || isGenerating}
            >
              Generate
            </Button>
          </Group>
        </Stack>
      </Modal>

      {matrix && selectedScene && (
        <Tabs
          defaultValue="editor"
          variant="outline"
          onChange={(tab) => {
            if (tab === "raw-data") {
              setRawMatrix(JSON.stringify(matrix, null, 2));
            }
          }}
        >
          <Tabs.List mb="md">
            <Tabs.Tab value="editor" data-testid="editor-tab">
              Editor
            </Tabs.Tab>
            <Tabs.Tab value="raw-data" data-testid="raw-data-tab">
              Raw Data
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="editor">
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
              <Group>
                <Button
                  onClick={() => {
                    updateCustomSceneData({
                      name: selectedScene.name,
                      coordinates: matrix,
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  Save Scene
                </Button>
                <Button
                  variant="light"
                  onClick={openAiModal}
                  style={{ flex: 1 }}
                  data-testid="ai-generate-button"
                >
                  AI Generate
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="raw-data">
            <Alert variant="light" color="red" my="sm">
              Raw Data Mode is only useful for importing or exporting scene
              data... Be careful!
            </Alert>
            <Textarea
              data-testid="raw-data-textarea"
              value={rawMatrix}
              onChange={(event) => {
                const { value } = event.currentTarget;
                setRawMatrix(value);
              }}
              rows={20}
            ></Textarea>
            <Button
              mt="md"
              fullWidth
              onClick={() => {
                try {
                  const parsedRawMatrix = JSON.parse(rawMatrix);
                  setMatrix(parsedRawMatrix);
                  updateCustomSceneData({
                    name: selectedScene.name,
                    coordinates: parsedRawMatrix,
                  });
                } catch (e) {
                  alert(e);
                }
              }}
            >
              Save Scene
            </Button>
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  );
}
