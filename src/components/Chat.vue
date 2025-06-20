<template>
  <div :key="formatterType" class="chat">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { formatterType } from '../lib/markdown'
</script>

<style lang="postcss" scoped>
.chat {
  display: block;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
}
</style>
