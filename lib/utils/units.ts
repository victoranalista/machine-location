export const pluralizeUnit = (quantity: number, unit: string): string => {
  if (quantity === 1) return unit;
  if (unit.endsWith('m') || unit.endsWith('kg') || unit.endsWith('l'))
    return unit;
  return `${unit}s`;
};
