import type { Arrayable } from './types'

const { log, floor, abs } = Math

interface AnalysisResult {
  min: number
  max: number
  sum: number
  values: number[]
  count: number
  domain: number[]
  limits: (mode: string, num: number) => number[]
}

type Data = (number | undefined | null)[] | Arrayable<Record<string, number | Record<string, number>>>

export function analyze(data: Data, key?: string): AnalysisResult {
  const values = Array.isArray(data) ? data : Object.values(data)
  const r = values.reduce((acc, val) => {
    if (key && typeof val === 'object')
      val = val?.[key]
    if (val != null && !Number.isNaN(val)) {
      acc.values.push(val as number)
      acc.sum += val as number
      acc.min = Math.min(acc.min, val as number)
      acc.max = Math.max(acc.max, val as number)
      acc.count += 1
    }
    return acc
  }, {
    min: Number.MAX_VALUE,
    max: -Number.MAX_VALUE,
    sum: 0,
    values: [],
    count: 0,
  } as Omit<AnalysisResult, 'domain' | 'limits' >)

  return {
    ...r,
    domain: [r.min, r.max],
    limits: (mode, num) => limits(r, mode, num),
  }
}

export function limits(
  data: (number | undefined | null)[] | { min: number, max: number, values: number[] },
  mode: string = 'equal',
  num: number = 7,
): number[] {
  if (Array.isArray(data)) {
    data = analyze(data)
  }
  const { min, max, values } = data
  const sortedValues = [...values].sort((a, b) => a - b)

  if (num === 1) {
    return [min, max]
  }

  const limits: number[] = []
  switch (mode[0]) {
    case 'c':{
      limits.push(min, max)
      break
    }

    case 'e':{
      limits.push(min)
      for (let i = 1; i < num; i++) {
        limits.push(min + (i / num) * (max - min))
      }
      limits.push(max)
      break
    }

    case 'l':{
      if (min <= 0) {
        throw new Error('Logarithmic scales are only possible for values > 0')
      }
      const min_log = Math.LOG10E * log(min)
      const max_log = Math.LOG10E * log(max)
      limits.push(min)
      for (let i = 1; i < num; i++) {
        limits.push(10 ** (min_log + (i / num) * (max_log - min_log)))
      }
      limits.push(max)
      break
    }

    case 'q':{
      limits.push(min)
      for (let i = 1; i < num; i++) {
        const p = ((sortedValues.length - 1) * i) / num
        const pb = floor(p)
        if (pb === p) {
          limits.push(sortedValues[pb])
        }
        else {
          const pr = p - pb
          limits.push(sortedValues[pb] * (1 - pr) + sortedValues[pb + 1] * pr)
        }
      }
      limits.push(max)
      break
    }

    case 'k':{
      const n = sortedValues.length
      const assignments: number[] = Array.from({ length: n })
      const clusterSizes: number[] = Array.from({ length: num }, () => 0)
      let centroids = Array.from({ length: num }, (_, i) => min + (i / num) * (max - min))
      let repeat = true
      let nbIters = 0

      while (repeat) {
        clusterSizes.fill(0)
        for (let i = 0; i < n; i++) {
          const value = sortedValues[i]
          let mindist = Number.MAX_VALUE
          let best = 0
          for (let j = 0; j < num; j++) {
            const dist = abs(centroids[j] - value)
            if (dist < mindist) {
              mindist = dist
              best = j
            }
          }
          clusterSizes[best]++
          assignments[i] = best
        }

        const newCentroids = Array.from({ length: num }, () => 0)
        for (let i = 0; i < n; i++) {
          newCentroids[assignments[i]] += sortedValues[i]
        }
        for (let j = 0; j < num; j++) {
          newCentroids[j] /= clusterSizes[j]
        }

        repeat = !newCentroids.every((c, i) => c === centroids[i])
        centroids = newCentroids
        nbIters++
        if (nbIters > 200) {
          repeat = false
        }
      }

      const kClusters: Record<number, number[]> = {}
      for (let j = 0; j < num; j++) {
        kClusters[j] = []
      }
      for (let i = 0; i < n; i++) {
        kClusters[assignments[i]].push(sortedValues[i])
      }

      const tmpKMeansBreaks = Object.values(kClusters).flatMap(cluster => [cluster[0], cluster[cluster.length - 1]])
      tmpKMeansBreaks.sort((a, b) => a - b)
      limits.push(tmpKMeansBreaks[0])
      for (let i = 1; i < tmpKMeansBreaks.length; i += 2) {
        const v = tmpKMeansBreaks[i]
        if (!Number.isNaN(v) && !limits.includes(v)) {
          limits.push(v)
        }
      }
      break
    }

    default:
      throw new Error(`Unknown mode: ${mode}`)
  }
  return limits
}
