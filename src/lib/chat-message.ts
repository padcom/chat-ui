export const Roles = [
  'system',
  'developer',
  'assistant',
  'tool',
  'user',
] as const

export type Role = typeof Roles[number]

export interface ChatMessage {
  id: string
  role: Role
  content?: string

  [key: string]: any
}
