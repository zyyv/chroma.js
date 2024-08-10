import Color from '../Color'

export default (...args) => {
  try {
    // eslint-disable-next-line no-new
    new Color(...args)
    return true
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    return false
  }
}
