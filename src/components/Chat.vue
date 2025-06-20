<template>
  <div :key="formatterType" class="chat">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { formatterType } from '../lib/formatter'
</script>
