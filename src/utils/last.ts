import { typeString } from './type-string'

export default (args) => {
  if (args.length < 2)
    return null
  const l = args.length - 1
  if (typeString(args[l]) === 'string')
    return args[l].toLowerCase()
  return null
}
