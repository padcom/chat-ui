<template>
  <Chat class="chat">
    <Messages v-slot="{ message }" :messages>
      <Message :message class="markdown-body">
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
import { v4 as uuid } from 'uuid'
import { ref, useTemplateRef, onMounted } from 'vue'
import { Chat, Messages, Message, Prompt, addMessage, type ChatMessage } from '.'

interface Msg extends ChatMessage {
  extra?: string
}

const prompt = useTemplateRef('prompt')

const messages = ref<Msg[]>([
  { id: '1', role: 'system', content: 'You are a helpful assistant using [LM Studio](https://lmstudio.ai)' },
  { id: '2', role: 'user', content: 'Who are you?' },
  { id: '3', role: 'assistant', content: 'I am your *faithful* AI assistant' },
  { id: '3.5', role: 'xxx', content: 'This is an example custom message' },
  { id: '4', role: 'user', content: 'Who are you?' },
  { id: '5', role: 'assistant', content: 'I am your **faithful** AI assistant' },
  { id: '6', role: 'user', content: 'Who are you?' },
  { id: '7', role: 'assistant', content: 'I am your _faithful_ AI assistant' },
])

function ask(question: string) {
  addMessage(messages, { extra: 'x', id: uuid(), role: 'user', content: question })
  const msg = addMessage(messages, { extra: 'y', id: uuid(), role: 'assistant', content: `` })

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
</style>
