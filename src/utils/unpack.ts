// import type from './type';

// export default (args, keyOrder = null) => {
//     // if called with more than 3 arguments, we return the arguments
//     if (args.length >= 3) return Array.prototype.slice.call(args);
//     // with less than 3 args we check if first arg is object
//     // and use the keyOrder string to extract and sort properties
//     if (type(args[0]) == 'object' && keyOrder) {
//         return keyOrder
//             .split('')
//             .filter((k) => args[0][k] !== undefined)
//             .map((k) => args[0][k]);
//     }
//     // otherwise we just return the first argument
//     // (which we suppose is an array of args)
//     return args[0];
// };

export default function unpack(args: unknown[], keyOrder?: string): number[] | unknown {
  // if called with more than 3 arguments, we return the arguments
  if (Array.isArray(args) && args.length >= 3)
    return Array.prototype.slice.call(args)

  // with less than 3 args we check if first arg is object
  // and use the keyOrder string to extract and sort properties
  if (typeof args[0] === 'object' && keyOrder) {
    const arg = args[0] as Record<string, number>
    return keyOrder
      .split('')
      .filter(k => arg[k] != null)
      .map(k => arg[k])
  }
  // otherwise we just return the first argument
  // (which we suppose is an array of args)
  return args[0]
}
