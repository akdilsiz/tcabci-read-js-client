import { Debug } from '@streetbyters/js-debug'

export function fromJSON(data) {
  return JSON.parse(data)
}

export function isJSON(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    Debug.error(e)
    return false
  }

  return true
}
