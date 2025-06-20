import type { Ref } from 'vue'

export const Roles = [
  'system',
  'developer',
  'assistant',
  'tool',
  'user',
  'error',
] as const

export type Role = typeof Roles[number] | (string & {})

export interface ChatMessage {
  id: string
  role: Role
  content?: string

  [key: string]: any
}

/**
 * This function adds a message to a reactive list of messages
 * and returns the added message as a reactive object.
 *
 * The problem this function solves is that if you just add
 * a message and then try to use the same message object to,
 * for example concatenate more text to the `content` property
 * then it will not be reflected in the UI because that object
 * is not reactive.
 *
 * @param messages reactive list of messages
 * @param message message to add to the list
 * @returns reactive message that can be manipulated
 */
export function addMessage<T extends ChatMessage>(messages: Ref<T[]>, message: T): T {
  messages.value.push(message)

  return messages.value.at(-1)!
}
