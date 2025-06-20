<template>
  <div class="messages">
    <slot name="before" />
    <template v-for="message in [...messages].reverse()" :key="message.id || uuid()">
      <slot :message>
        <Message :message />
      </slot>
    </template>
    <slot name="after" />
  </div>
</template>

<script lang="ts" setup generic="T extends ChatMessage">
import { uuid, type ChatMessage } from '..'

import Message from './Message.vue'

defineProps<{ messages: T[] }>()
</script>
