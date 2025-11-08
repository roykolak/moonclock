import { Box, Stack, Text } from "@mantine/core";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
}

const COLORS = [
  [
    "#ff0000",
    "#ff6600",
    "#ffcc00",
    "#ccff00",
    "#00ff00",
    "#00ff66",
    "#00ffcc",
    "#00ccff",
  ],
  [
    "#0066ff",
    "#0000ff",
    "#6600ff",
    "#cc00ff",
    "#ff00cc",
    "#ff0066",
    "#ffffff",
    "#000000",
  ],
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <Stack gap={8}>
      {label && <Text size="sm">{label}</Text>}
      {COLORS.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          style={{
            display: "flex",
            gap: "8px",
            width: "100%",
          }}
        >
          {row.map((color) => (
            <Box
              key={color}
              onClick={() => onChange(color)}
              style={{
                flex: 1,
                aspectRatio: "1",
                maxWidth: 64,
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                border:
                  value === color
                    ? "2px solid white"
                    : "2px solid rgba(255, 255, 255, 0.3)",
                boxShadow:
                  value === color ? "0 0 8px rgba(255, 255, 255, 0.5)" : "none",
              }}
            />
          ))}
        </Box>
      ))}
    </Stack>
  );
}
