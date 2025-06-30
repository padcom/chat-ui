import type { Ref } from 'vue'
import { addMessage, filterSyntheticMessages, type ChatMessage } from './lib'

/**
 * Base class for assistants
 */
export abstract class Assistant {
  /**
   * Initialize an assistant session (aka chat)
   *
   * @param messages ref to a list of messages
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async initSession(messages: Ref<ChatMessage[]>) {
  }

  /**
   * Asks a question
   *
   * @param question question to ask
   * @param messages ref to a list of all messages
   * @param signal signal to use to abort the response
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async query(question: string, messages: Ref<ChatMessage[]>, signal?: AbortSignal) {
    throw new Error('Not implemented')
  }
}

/**
 * A dumb assistant that responds with the given text
 */
export class DumpAssistant extends Assistant {
  private sleep(ms: number) {
    return new Promise(resolve => { setTimeout(resolve, ms) })
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
export class RealAssistant extends Assistant {
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
