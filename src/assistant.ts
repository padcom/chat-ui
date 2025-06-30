import type { Ref } from 'vue'
import { addMessage, filterSyntheticMessages, type ChatMessage } from './lib'
import type { Session } from './LanguageModel'

/**
 * Base class for assistants
 */
export interface Assistant {
  /**
   * Initialize an assistant session (aka chat)
   *
   * @returns messages list of messages
   */
  initSession(messages: Ref<ChatMessage[]>, systemPrompt?: string): Promise<void>

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
    messages.value = [
      { id: '1', role: 'system', content: 'You are a helpful assistant using [LM Studio](https://lmstudio.ai)' },
      { role: 'user', content: 'Hello', green: true },
      { role: 'user', content: 'Who are you?', green: true },
      { role: 'assistant', content: 'I am your *faithful* AI assistant' },
      { role: 'assistant', content: 'Ask me anything' },
      { role: 'xxx', content: 'This is an example custom message' },
      { role: 'user', content: 'Who are you?', green: true },
      { id: '1234', role: 'error', content: 'Error: connection refused' },
      { role: 'user', content: 'Who are you?' },
      { role: 'assistant', image: 'landscape.png' },
      { role: 'user', content: 'Who are you?' },
      { role: 'assistant', content: 'I am your _faithful_ AI assistant' },
    ]

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
  private session?: Session

  async initSession(messages: Ref<ChatMessage[]>, systemPrompt: string) {
    messages.value = [
      { role: 'system', content: systemPrompt.trim() },
    ]

    const message = addMessage(messages, { role: 'synthetic' })

    this.session = await window.LanguageModel.create({
      initialPrompts: filterSyntheticMessages(messages.value),
      monitor(m) {
        m.addEventListener('downloadprogress', e => { console.log(e) })
        m.addEventListener('downloadprogress', e => {
          message.content = `Model download: ${e.loaded * 100}%`
        })
      },
    })
  }

  async query(question: string, messages: Ref<ChatMessage[]>, signal?: AbortSignal) {
    addMessage(messages, { role: 'user', content: question })
    const message = addMessage(messages, { role: 'assistant', content: '' })
    const stream = this.session!.promptStreaming(question, { signal })
    for await (const chunk of stream) message.content += String(chunk)
  }
}
