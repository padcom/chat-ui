import type { Ref } from 'vue'
import { addMessage, filterSyntheticMessages, type ChatMessage } from './lib'

/**
 * Base class for assistants
 */
export interface Assistant {
  /**
   * Initialize an assistant session (aka chat)
   *
   * @returns messages list of messages
   */
  initSession(messages: Ref<ChatMessage[]>): Promise<void>

  /**
   * Asks a question
   *
   * @param question question to ask
   * @param messages ref to a list of all messages
   * @param signal signal to use to abort the response
   */
  query(question: string, messages: Ref<ChatMessage[]>, signal?: AbortSignal): Promise<void>
}

/**
 * A dumb assistant that responds with the given text
 */
export class DumpAssistant implements Assistant {
  private sleep(ms: number) {
    return new Promise(resolve => { setTimeout(resolve, ms) })
  }

  async initSession(messages: Ref<ChatMessage[]>) {
    messages.value = []

    return Promise.resolve()
  }

  async query(question: string, messages: Ref<ChatMessage[]>) {
    addMessage(messages, { role: 'user', content: question })
    const msg = addMessage(messages, { role: 'assistant', content: '' })
    await this.sleep(1000)
    msg.content = `Here is my answer to the question _${question}_: I do not know, sorry..`
  }
}

/**
 * Check if the AI API is available in the browser
 *
 * @returns true if the API is available, false otherwise
 */
export function hasEmbeddedLanguageModel() {
  // @ts-ignore not typed yet
  return Boolean(window.LanguageModel)
}

/**
 * An assistant that uses the embedded LanguageModel API (Chrome 107+)
 */
export class RealAssistant implements Assistant {
  private session: any

  async initSession(messages: Ref<ChatMessage[]>) {
    messages.value = []

    addMessage(messages, { role: 'system', content: 'You are a helpful assistant' })
    const message = addMessage(messages, { role: 'synthetic' })

    // @ts-ignore not typed yet
    this.session = await LanguageModel.create({
      initialPrompts: filterSyntheticMessages(messages.value),
      // @ts-ignore not typed yet
      monitor(m) {
        m.addEventListener('downloadprogress', (e: any) => {
          message.content = `Downloaded ${e.loaded * 100}%`
        })
      },
    })
  }

  async query(question: string, messages: Ref<ChatMessage[]>, signal?: AbortSignal) {
    addMessage(messages, { role: 'user', content: question })
    const message = addMessage(messages, { role: 'assistant', content: '' })
    const stream = this.session.promptStreaming(question, { signal })
    for await (const chunk of stream) message.content += String(chunk)
  }
}
