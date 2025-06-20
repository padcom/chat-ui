let formatter: (source: string) => string | Promise<string> = (source: string) => source

async function initMarked(name = 'marked') {
  try {
    const { marked } = await import(name)
    const renderer = new marked.Renderer()

    // Specialized link renderer that will create links that open up in new window/tab
    renderer.link = function({ href, title, text }: any) {
      return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
    }

    formatter = (source: string) => marked(source || '', { renderer })
  } catch {
    console.log('marked package not found. Markdown content will not be formatted')
  }
}

void initMarked()

export function markdown(source?: string) {
  return formatter(source || '')
}
