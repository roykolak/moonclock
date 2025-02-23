export function getFriendlyTimeAdjustmentAmount(adjustmentAmount: number) {
  const abs = Math.abs(adjustmentAmount);

  const prefix = adjustmentAmount > 0 ? "+" : "-";
  const unit = abs < 60 ? `min` : `hour`;
  const amount = abs < 60 ? adjustmentAmount : adjustmentAmount / 60;

  return `${prefix}${amount} ${unit}`;
}
