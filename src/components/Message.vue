<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-if="message.content" :class="{ message: true, [message.role]: true }"
    v-html="format(message)"
  />
  <div v-else class="message" :class="{ [message.role]: true }">
    <slot>...</slot>
  </div>
</template>

<script lang="ts" setup generic="T extends ChatMessage">
import { format, type ChatMessage } from '../lib'

defineProps<{ message: T }>()
</script>
