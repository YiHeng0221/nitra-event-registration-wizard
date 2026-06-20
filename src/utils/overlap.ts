/**
 * Whether two time ranges overlap. Touching edges (one ends exactly when the
 * other starts) do NOT count as a conflict.
 */
export function isOverlapping(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && startB < endA
}
