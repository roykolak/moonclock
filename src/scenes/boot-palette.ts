const GLOW = [238, 159, 39] as const;

export function bootGlow(alpha = 1) {
  return `rgba(${GLOW[0]}, ${GLOW[1]}, ${GLOW[2]}, ${alpha})`;
}
