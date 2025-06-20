<template>
  <Chat class="chat">
    <!-- <pre>{{ JSON.stringify(messages, null, 2) }}</pre> -->
    <Messages v-slot="{ message }" :messages>
      <div v-if="message.image" :class="{ message: true, image: true, [message.role]: true }">
        <img :src="message.image" :alt="message.image" :title="message.image">
      </div>
      <Message v-else :message class="markdown-body">
        ...{{ message.extra }}
      </Message>
    </Messages>
    <Prompt ref="prompt" placeholder="Press Enter to send, Ctrl+Del to clear messages"
      @query="ask"
      @keydown.ctrl.delete="messages = []"
    />
  </Chat>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Chat, Messages, Message, Prompt, addMessage, type ChatMessage, setChatMessageFormatter } from '.'
import { marked } from 'marked'

const sleep = (ms: number) => new Promise(resolve => { setTimeout(resolve, ms) })

// This is a super-crazy formatter that not only displays the message
// but also adds the role and message id (if present) at the top
setChatMessageFormatter(async message => {
  await sleep(100)

  return `
    <p><b>${message.role}</b> ${message.id ? ` / <i>${message.id}</i>` : ''}</p>
    ${marked(message.content || '') as string}
  `
})

interface Msg extends ChatMessage {
  extra?: string
  image?: string
}

const prompt = ref<InstanceType<typeof Prompt>>()

const messages = ref<Msg[]>([
  { id: '1', role: 'system', content: 'You are a helpful assistant using [LM Studio](https://lmstudio.ai)' },
  { role: 'user', content: 'Who are you?' },
  { role: 'assistant', content: 'I am your *faithful* AI assistant' },
  { role: 'xxx', content: 'This is an example custom message' },
  { role: 'user', content: 'Who are you?' },
  { id: '1234', role: 'error', content: 'Error: connection refused' },
  { role: 'user', content: 'Who are you?' },
  { role: 'assistant', image: 'landscape.png' },
  { role: 'user', content: 'Who are you?' },
  { role: 'assistant', content: 'I am your _faithful_ AI assistant' },
])

function ask(question: string) {
  addMessage(messages, { extra: 'x', role: 'user', content: question })
  const msg = addMessage(messages, { extra: 'y', role: 'assistant', content: `` })

  setTimeout(() => { msg.content = `Here is my answer to the question _${question}_: I do not know, sorry..` }, 2000)
}

onMounted(() => {
  prompt.value?.focus()
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

.message.xxx {
  align-self: center;
  text-align: center;
  width: 100%;
  background-color: antiquewhite
}

.message.image img {
  max-width: 50%;
}
</style>
