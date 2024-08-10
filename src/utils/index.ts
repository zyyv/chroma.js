const { PI, min, max } = Math

export { default as clip_rgb } from './clip_rgb'
export { default as limit } from './limit'
export * from './type-string'
export { default as unpack } from './unpack'
export { default as last } from './last'

const TWOPI = PI * 2
const PITHIRD = PI / 3
const DEG2RAD = PI / 180
const RAD2DEG = 180 / PI

export { PI, TWOPI, PITHIRD, DEG2RAD, RAD2DEG, min, max }
