<template>
  <Chat class="chat">
    <div class="system-prompt">
      <label>System prompt</label>
      <textarea v-model="systemPrompt"></textarea>
    </div>
    <Messages v-slot="{ message }" :messages>
      <div v-if="message.image" :class="{ message: true, [message.role]: true, image: true }">
        <img :src="message.image" :alt="message.image" :title="message.image">
        <!-- <p>{{ message.image }}</p> -->
      </div>
      <Message v-else :message class="markdown-body" :class="{ green: message.green }">
        ...{{ message.extra }}
      </Message>
    </Messages>
    <Prompt ref="prompt" placeholder="Press Enter to send, Ctrl+Del to clear messages, Esc to abort response"
      @query="ask"
      @keydown.ctrl.delete="newConversation()"
      @keydown.esc="abort()"
    />
  </Chat>
</template>

<script lang="ts" setup>
import { ref, onMounted, shallowRef } from 'vue'
import { Chat, Messages, Message, Prompt, setChatMessageFormatter, type ChatMessage, type Role } from '.'
import { marked } from 'marked'
import { hasEmbeddedLanguageModel, type Assistant, DumpAssistant, RealAssistant } from './assistant'

function getRoleTextAlignment(role: Role) {
  switch (role) {
    case 'assistant': return 'left'
    case 'user': return 'right'
    default: return 'center'
  }
}

// This is a super-crazy formatter that not only displays the message
// but also adds the role and message id (if present) at the top.
setChatMessageFormatter(message => `
  <p style="text-align: ${getRoleTextAlignment(message.role)}">
    <b>${message.role}</b> ${message.id ? ` / <i>${message.id}</i>` : ''}
  </p>
  ${marked(message.content || '', { async: false })}
`)

interface Msg extends ChatMessage {
  extra?: string
  image?: string
}

const prompt = ref<InstanceType<typeof Prompt>>()

const messages = ref<Msg[]>([])

const systemPrompt = ref([
  'You are an assistant that takes the user message and translates it to Polish.',
  'Respond only with the Polish translation and nothing else.',
].join('\n'))

const assistant = shallowRef<Assistant>(hasEmbeddedLanguageModel()
  ? new RealAssistant()
  : new DumpAssistant())

const abortController = shallowRef<AbortController>()

async function ask(question: string) {
  abortController.value = new AbortController()
  await assistant.value.query(question, messages, abortController.value.signal)
  // eslint-disable-next-line require-atomic-updates
  abortController.value = undefined
}

function abort() {
  abortController.value?.abort('User stopped the response')
}

function newConversation() {
  return assistant.value.initSession(messages, systemPrompt.value)
}

onMounted(async () => {
  prompt.value?.focus()
  await newConversation()
})
</script>

<style lang="postcss">
html, body {
  margin: 0;
  padding: 0;
  width: 100dvw;
  height: 100dvh;
}
</style>

<style lang="postcss" scoped>
.chat {
  max-width: clamp(400px, 50%, 50%);
  height: calc(100dvh - 2rem);
  margin-inline: auto;
  padding-block: 1rem;
}

.system-prompt {
  display: flex;
  flex-direction: column;

  & label {
    font-weight: bold;
    margin-bottom: 2px;
  }

  & textarea {
    width: 100%;
    height: 4rem;
  }
}

.message.xxx {
  align-self: center;
  text-align: center;
  width: 100%;
  background-color: antiquewhite
}

.message.image {
  background-color: transparent !important;
  &:before, &:after { display: none; }

  & img {
    max-width: 50%;
  }
}

.message.green {
  --chat-user-bg: #35ce5c;
}
</style>
