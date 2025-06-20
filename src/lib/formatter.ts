import { ref } from 'vue'
import { uuid, type ChatMessage } from '.'

export type ChatMessageFormatter = (message: ChatMessage) => string | Promise<string>

export const formatterType = ref('plain')

let formatter: ChatMessageFormatter = source => source.content || ''

/**
 * Sets a custom message formatter.
 * You can install one of the available message formatters from
 * [npm](https://www.npmjs.com/search?q=keywords:@padcom/chat-ui-formatter)
 *
 * @param fn custom message formatter
 */
export function setChatMessageFormatter(fn: ChatMessageFormatter) {
  formatter = fn
  formatterType.value = uuid()
}

export function format(message: ChatMessage) {
  return formatter(message)
}
