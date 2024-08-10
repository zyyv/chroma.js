import { version } from '../package.json'
import Color from './Color'

function chroma(...args) {
  return new chroma.Color(...args)
}

chroma.Color = Color
chroma.version = version

export default chroma
