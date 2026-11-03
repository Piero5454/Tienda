<script setup lang="ts">
defineProps<{ label: string; title: string; text?: string }>()
</script>

<template>
  <div class="sec-head">
    <p class="label">{{ label }}</p>
    <div>
      <h2>{{ title }}</h2>
      <p v-if="text">{{ text }}</p>
    </div>
  </div>
</template>
