<script setup lang="ts">
// Selector entre las demos disponibles
const route = useRoute()
const demos = [
  { to: '/demo-punto-de-venta', label: 'Punto de venta', sub: 'Caja de almacén' },
  { to: '/demo-app-reservas', label: 'App de reservas', sub: 'Barbería' }
]
</script>

<template>
  <nav class="demo-switch" aria-label="Elige una demo">
    <NuxtLink v-for="d in demos" :key="d.to" :to="d.to" :class="{ on: route.path.startsWith(d.to) }" :aria-current="route.path.startsWith(d.to) ? 'page' : undefined">
      <b>{{ d.label }}</b><small>{{ d.sub }}</small>
    </NuxtLink>
  </nav>
</template>
