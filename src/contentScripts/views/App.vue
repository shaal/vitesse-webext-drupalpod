<template>
  <button class="testing" @click="toggle()">
    <pixelarticons-power />
  </button>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'virtual:windi.css'

const [show, toggle] = useToggle(false)
</script>

<style scoped>
  .testing {
    background-color: red;
  }
</style>
