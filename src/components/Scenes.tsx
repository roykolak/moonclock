"use client";

import {
  ActionIcon,
  Card,
  Checkbox,
  Group,
  InputLabel,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical, IconSettings, IconTrash } from "@tabler/icons-react";
import { Preset, SceneName } from "../types";
import { ColorPicker } from "./ColorPicker";

interface ScenesProps {
  form: UseFormReturnType<Preset>;
  customSceneNames: string[];
}

export function Scenes({ form, customSceneNames }: ScenesProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const scenes = form.getValues().scenes;
      const oldIndex = scenes.findIndex((_, i) => `scene-${i}` === active.id);
      const newIndex = scenes.findIndex((_, i) => `scene-${i}` === over.id);

      const newScenes = arrayMove(scenes, oldIndex, newIndex);
      form.setFieldValue("scenes", newScenes);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={form.getValues().scenes.map((_, i) => `scene-${i}`)}
        strategy={verticalListSortingStrategy}
      >
        {form.getValues().scenes.map((_, index) => (
          <Scene
            key={`scene-${index}`}
            id={`scene-${index}`}
            form={form}
            index={index}
            customSceneNames={customSceneNames}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function Scene({
  id,
  form,
  index,
  customSceneNames,
}: {
  id: string;
  form: UseFormReturnType<Preset>;
  index: number;
  customSceneNames: string[];
}) {
  const [sceneControlsVisible, sceneControlshandlers] = useDisclosure();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Group key={index} w="100%" mb="xs" ref={setNodeRef} style={style}>
      <Group w="100%" gap="6">
        <ActionIcon
          variant="light"
          size="lg"
          style={{ cursor: "grab" }}
          data-testid={`scene-${index}-drag-handle`}
          {...attributes}
          {...listeners}
        >
          <IconGripVertical size={18} />
        </ActionIcon>
        <Select
          placeholder="Scene"
          variant="filled"
          style={{ flex: "auto" }}
          data={[
            {
              group: "Built-in Scenes",
              items: [
                SceneName.Moon,
                SceneName.Message,
                SceneName.Color,
                SceneName.Twinkle,
                SceneName.Ripple,
                SceneName.Marquee,
                SceneName.Emoji,
              ],
            },
            {
              group: "Custom Scenes",
              items: customSceneNames,
            },
          ]}
          data-testid={`scene-${index}-select`}
          required
          allowDeselect={false}
          key={form.key(`scenes.${index}.sceneName`)}
          {...form.getInputProps(`scenes.${index}.sceneName`)}
        />
        <ActionIcon
          variant="light"
          data-testid={`scene-${index}-settings-button`}
          onClick={sceneControlshandlers.toggle}
          size="lg"
        >
          <IconSettings size={22} />
        </ActionIcon>
        <ActionIcon
          color="red"
          variant="light"
          size="lg"
          data-testid={`scene-${index}-delete-button`}
          onClick={() => form.removeListItem("scenes", index)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      {sceneControlsVisible && (
        <SceneConfigControls form={form} index={index} />
      )}
    </Group>
  );
}

export function SceneConfigControls({
  form,
  index,
}: {
  form: UseFormReturnType<Preset>;
  index: number;
}) {
  const { sceneName, sceneConfig } = form.getValues().scenes[index];

  const supportedEmojis = [
    ["🎉", "tada"],
    ["✅", "checkmark"],
    ["😄", "smile"],
    ["🔥", "flame"],
    ["👍", "thumbsup"],
    ["👎", "thumbsdown"],
    ["❌", "x"],
  ];

  if (sceneName === "emoji") {
    return (
      <Group gap="xs">
        {supportedEmojis.map((supportedEmoji) => {
          const [emoji, name] = supportedEmoji;
          return (
            <ActionIcon
              key={name}
              color={sceneConfig.name === name ? "cyan" : "gray"}
              onClick={() =>
                form.setFieldValue(`scenes.${index}.sceneConfig.name`, name)
              }
            >
              {emoji}
            </ActionIcon>
          );
        })}
      </Group>
    );
  }

  if (sceneName === "moon") {
    return (
      <Card w="100%">
        <Stack>
          <InputLabel>Animate star twinkle</InputLabel>
          <Checkbox
            labelPosition="left"
            key={form.key(`scenes.${index}.sceneConfig.animateStarTwinkle`)}
            checked={form.values.scenes[index].sceneConfig.animateStarTwinkle}
            {...form.getInputProps(
              `scenes.${index}.sceneConfig.animateStarTwinkle`
            )}
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === "twinkle") {
    return (
      <Card w="100%">
        <Stack>
          <Stack gap={4}>
            <Text size="sm">Twinkle Speed</Text>
            <Slider
              label={null}
              min={5}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.speed`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Twinkle Amount</Text>
            <Slider
              label={null}
              max={1000}
              key={form.key(`scenes.${index}.sceneConfig.amount`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.amount`)}
            />
          </Stack>
          <ColorPicker
            value={form.values.scenes[index].sceneConfig.color}
            onChange={(color) =>
              form.setFieldValue(`scenes.${index}.sceneConfig.color`, color)
            }
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === SceneName.Color) {
    return (
      <Card w="100%">
        <Stack>
          <ColorPicker
            value={form.values.scenes[index].sceneConfig.color}
            onChange={(color) =>
              form.setFieldValue(`scenes.${index}.sceneConfig.color`, color)
            }
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === "ripple") {
    return (
      <Card w="100%">
        <Stack>
          <Stack gap={4}>
            <Text size="sm">Speed</Text>
            <Slider
              label={null}
              min={5}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.speed`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Wave height</Text>
            <Slider
              label={null}
              step={1}
              max={10}
              min={1}
              key={form.key(`scenes.${index}.sceneConfig.waveHeight`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.waveHeight`)}
            />
          </Stack>
          <ColorPicker
            value={form.values.scenes[index].sceneConfig.color}
            onChange={(color) =>
              form.setFieldValue(`scenes.${index}.sceneConfig.color`, color)
            }
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === "marquee") {
    return (
      <Card w="100%">
        <Stack>
          <TextInput
            label="Message"
            key={form.key(`scenes.${index}.sceneConfig.text`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.text`)}
          />
          <Stack gap={4}>
            <Text size="sm">Font size</Text>
            <Slider
              min={12}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.fontSize`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.fontSize`)}
            />
          </Stack>
          <Checkbox
            label="Mirror horizontally"
            checked={form.values.scenes[index].sceneConfig.mirrorHorizontally}
            key={form.key(`scenes.${index}.sceneConfig.mirrorHorizontally`)}
            {...form.getInputProps(
              `scenes.${index}.sceneConfig.mirrorHorizontally`
            )}
          />
          <Stack gap={4}>
            <Text size="sm">Speed</Text>
            <Slider
              min={5}
              max={60}
              key={form.key(`scenes.${index}.sceneConfig.speed`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.speed`)}
            />
          </Stack>
          <Stack gap={4}>
            <Text size="sm">Starting row</Text>
            <Slider
              max={32}
              key={form.key(`scenes.${index}.sceneConfig.startingRow`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.startingRow`)}
            />
          </Stack>
          <ColorPicker
            value={form.values.scenes[index].sceneConfig.color}
            onChange={(color) =>
              form.setFieldValue(`scenes.${index}.sceneConfig.color`, color)
            }
          />
        </Stack>
      </Card>
    );
  }

  if (sceneName === "message") {
    return (
      <Card w="100%">
        <Stack>
          <Textarea
            label="Message"
            key={form.key(`scenes.${index}.sceneConfig.text`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.text`)}
          />
          <Stack gap={4}>
            <Text size="sm">Font size</Text>
            <Slider
              min={7}
              max={20}
              key={form.key(`scenes.${index}.sceneConfig.fontSize`)}
              {...form.getInputProps(`scenes.${index}.sceneConfig.fontSize`)}
            />
          </Stack>
          <SegmentedControl
            fullWidth
            data={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
            key={form.key(`scenes.${index}.sceneConfig.alignment`)}
            {...form.getInputProps(`scenes.${index}.sceneConfig.alignment`)}
          />
          <ColorPicker
            value={form.values.scenes[index].sceneConfig.color}
            onChange={(color) =>
              form.setFieldValue(`scenes.${index}.sceneConfig.color`, color)
            }
          />
        </Stack>
      </Card>
    );
  }

  return (
    <Card w="100%">
      <Text ta="center" size="xs">
        No scene options available
      </Text>
    </Card>
  );
}
