import type { ChatMessage } from './lib'

interface SessionPromptStreamingOptions {
  signal?: AbortSignal
}

export interface Session {
  promptStreaming(question: string, options?: SessionPromptStreamingOptions): AsyncGenerator<string>
}

interface LanguageModelCreateMonitorEvent {
  loaded: number
}

interface LanguageModelCreateMonitor {
  addEventListener(event: 'downloadprogress', cb: (e: LanguageModelCreateMonitorEvent) => void): void
}

interface LanguageModelCreateOptions {
  initialPrompts: ChatMessage[]
  monitor(monitor: LanguageModelCreateMonitor): void
}

interface LanguageModelClass {
  create(options: LanguageModelCreateOptions): Promise<Session>
}

declare global {
  interface Window {
    LanguageModel: LanguageModelClass
  }
}
