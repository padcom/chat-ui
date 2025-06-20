import { ref } from 'vue'
import { uuid, type ChatMessage } from '.'

export type ChatMessageFormatter = (message: ChatMessage) => string | Promise<string>

export const formatterType = ref('plain')

let formatter: ChatMessageFormatter = source => source.content || ''

export function setChatMessageFormatter(fn: ChatMessageFormatter) {
  formatter = fn
  formatterType.value = uuid()
}

export function format(message: ChatMessage) {
  return formatter(message)
}

// async function initializeMarked() {
//   try {
//     const { marked } = await import(/* @vite-ignore */ 'marked')
//     const renderer = new marked.Renderer()

//     // Specialized link renderer that will create links that open up in new window/tab
//     renderer.link = function({ href, title, text }) {
//       return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
//     }

//     formatter = (source: string) => marked(source || '', { renderer })
//     formatterType.value = 'marked'
//   } catch {
//     console.log('[chat-ui] "marked" package not found - markdown content will not be formatted')
//   }
// }

// void initializeMarked()
