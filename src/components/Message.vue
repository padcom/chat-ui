<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-if="message.content" :class="{ message: true, [message.role]: true }"
    v-html="markdown(message.content)"
  />
  <div v-else class="message" :class="{ [message.role]: true }">
    <slot>...</slot>
  </div>
</template>

<script lang="ts" setup generic="T extends ChatMessage">
import { markdown, type ChatMessage } from '../lib'

defineProps<{ message: T }>()
</script>

<style lang="postcss" scoped>
.message {
  max-width: 80%;
  border-radius: 1rem;
  padding: 8px 12px 8px 12px;
}

.message > :deep(p) {
  margin: 0;
  padding: 0;
}

.message.assistant {
  border-bottom-left-radius: 0;
}
.message.user {
  border-bottom-right-radius: 0;
}

.message.system,
.message.developer,
.message.tool,
.message.error {
  align-self: center;
  text-align: center;
}
.message.assistant {
  align-self: self-start;
}
.message.user {
  align-self: self-end;
  text-align: right;
}

.message.system,
.message.developer,
.message.tool {
  background-color: rgb(250, 237, 241);
}
.message.assistant {
  background-color: #e9e9eb;
}
.message.user {
  /* background-color: #35ce5c; */
  background-color: #0080ff;
  color: white;
}
.message.error {
  background-color: red;
  color: white;
}
</style>
