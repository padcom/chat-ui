<template>
  <div class="prompt">
    <slot name="left" :ask :question />
    <slot :ask :question>
      <input ref="input" v-model="question" type="text" v-bind="$attrs" @keydown.enter="ask()">
    </slot>
    <slot name="right" :ask :question />
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'

const emit = defineEmits<{ (e: 'query', question: string): void }>()

const input = useTemplateRef('input')
const question = ref('')

function ask() {
  if (question.value.trim()) {
    emit('query', question.value.trim())
    question.value = ''
  }
}

function focus() {
  input.value?.focus()
}

defineExpose({
  focus,
})
</script>

<style lang="postcss" scoped>
.prompt {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding-inline-start: 0.5rem;
}

.prompt input {
  flex-grow: 1;
  padding: 0.5rem;
  border-radius: 1rem;
}
</style>
