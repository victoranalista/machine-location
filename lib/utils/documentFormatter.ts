import { FEDERAL_ORGANS } from '@/utils/constants';

export const formatIssuingOrgan = (organ: string, state?: string): string => {
  if (!organ) return '';
  const isFederalOrgan = FEDERAL_ORGANS.includes(
    organ as (typeof FEDERAL_ORGANS)[number]
  );
  if (isFederalOrgan || !state) return organ;
  return `${organ}/${state}`;
};
