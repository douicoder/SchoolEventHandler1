export const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export function parseClass(value: unknown): number | null {
  const classLevel = Number(value);
  if (!Number.isInteger(classLevel) || classLevel < 1 || classLevel > 12) return null;
  return classLevel;
}

export function isClassEligible(
  studentClass: number | null | undefined,
  classMin: number,
  classMax: number,
): boolean {
  if (studentClass == null) return false;
  return studentClass >= classMin && studentClass <= classMax;
}

export function formatClassRange(classMin: number, classMax: number): string {
  if (classMin === classMax) return `Class ${classMin}`;
  return `Classes ${classMin}-${classMax}`;
}

export function getStudentClass(profile: { class?: number | string | null }): number | null {
  return parseClass(profile.class);
}
