/**
 * This function returns a unique identifier
 *
 * @returns unique identifier (UUID)
 */
export function uuid() {
  return crypto.randomUUID()
}
