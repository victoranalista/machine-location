type DecimalLike = {
  toNumber(): number;
  toString(): string;
};

type DecimalValue = DecimalLike | number | string;

export const toNumber = (value: DecimalValue): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if ('toNumber' in value) return value.toNumber();
  return 0;
};

export const serializeDecimal = <T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): T => {
  const result = { ...obj };
  fields.forEach((field) => {
    const value = result[field];
    if (value !== null && value !== undefined) {
      result[field] = toNumber(value as DecimalValue) as T[keyof T];
    }
  });
  return result;
};

type InventoryItemWithDecimal = {
  currentStock: DecimalValue;
  minimumStock: DecimalValue;
  unitCost: DecimalValue;
};

type LineItemWithDecimal = {
  plannedCost: DecimalValue;
  realizedCost: DecimalValue;
  quantity: DecimalValue;
};

type ProjectWithDecimal = {
  totalBudget: DecimalValue;
};

export const serializeInventoryItem = <T extends InventoryItemWithDecimal>(
  item: T
): T => ({
  ...item,
  currentStock: Number(item.currentStock),
  minimumStock: Number(item.minimumStock),
  unitCost: Number(item.unitCost)
});

export const serializeLineItem = <T extends LineItemWithDecimal>(
  item: T
): T => ({
  ...item,
  plannedCost: Number(item.plannedCost),
  realizedCost: Number(item.realizedCost),
  quantity: Number(item.quantity)
});

export const serializeProject = <T extends ProjectWithDecimal>(
  project: T
): T => ({
  ...project,
  totalBudget: Number(project.totalBudget)
});
