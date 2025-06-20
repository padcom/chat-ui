import { marked } from 'marked'

const renderer = new marked.Renderer()

// Specialized link renderer that will create links that open up in new window/tab
renderer.link = function({ href, title, text }) {
  return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
}

export function markdown(source?: string) {
  return marked(source || '', { renderer })
}
