import { ref } from 'vue'

let formatter: (source: string) => string | Promise<string> = (source: string) => source

export const formatterType = ref<'plain' | 'marked'>('plain')

export function markdown(source?: string) {
  return formatter(source || '')
}

async function initializeMarked() {
  try {
    const { marked } = await import(/* @vite-ignore */ 'marked')
    const renderer = new marked.Renderer()

    // Specialized link renderer that will create links that open up in new window/tab
    renderer.link = function({ href, title, text }) {
      return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
    }

    formatter = (source: string) => marked(source || '', { renderer })
    formatterType.value = 'marked'
  } catch {
    console.log('marked package not found. Markdown content will not be formatted')
  }
}

void initializeMarked()
