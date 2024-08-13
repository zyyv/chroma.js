export default function limit(x: number, low: number = 0, high: number = 1): number {
  return Math.min(Math.max(low, x), high)
}
