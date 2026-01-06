export type NormalizedPlanDays = '30' | '60';

export const normalizePlanDays = (value: unknown): NormalizedPlanDays | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return normalizePlanDays(String(value));
  }

  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (trimmed === '30' || trimmed === '60') return trimmed;

  return null;
};
