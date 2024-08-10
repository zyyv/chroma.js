// ported from jQuery's $.type
const classToType = {}
for (const name of [
  'Boolean',
  'Number',
  'String',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Undefined',
  'Null',
]) {
  classToType[`[object ${name}]`] = name.toLowerCase()
}

export function typeString(obj: unknown): string {
  return classToType[Object.prototype.toString.call(obj)] || 'object'
}
