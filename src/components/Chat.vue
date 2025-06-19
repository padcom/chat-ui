<template>
  <div class="chat">
    <slot />
  </div>
</template>

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
