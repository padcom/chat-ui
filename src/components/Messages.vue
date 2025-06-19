<template>
  <div class="messages">
    <slot name="before" />
    <template v-for="message in [...messages].reverse()" :key="message.id">
      <slot :message>
        <Message :message />
      </slot>
    </template>
    <slot name="after" />
  </div>
</template>

<script lang="ts" setup generic="T extends ChatMessage">
import { type ChatMessage } from '..'

import Message from './Message.vue'

defineProps<{ messages: T[] }>()
</script>

<style lang="postcss" scoped>
.messages {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  overflow: auto;
  flex-grow: 1;
  padding-inline: 0.5rem;
}
</style>
