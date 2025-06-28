import { v4 } from 'uuid'

/**
 * This function returns a unique identifier
 *
 * @returns unique identifier (UUID)
 */
export function uuid() {
  return v4()
}
