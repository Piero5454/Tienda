<script setup lang="ts">
const links = [
  { hash: '#servicios', label: 'Servicios' },
  { hash: '#ejemplos', label: 'Ejemplos' },
  { hash: '#proceso', label: 'Proceso' },
  { hash: '#sobre-mi', label: 'Sobre mí' },
  { hash: '#preguntas', label: 'Preguntas' }
]
const { abrir } = useCotizador()
</script>

<template>
  <nav class="nav" aria-label="Principal">
    <div class="wrap">
      <NuxtLink class="brand" to="/"><i aria-hidden="true"></i>Plano Digital</NuxtLink>
      <ul>
        <li v-for="l in links" :key="l.hash"><NuxtLink :to="{ path: '/', hash: l.hash }">{{ l.label }}</NuxtLink></li>
      </ul>
      <div class="nav-cta">
        <NuxtLink class="btn btn-primary" to="/demo-punto-de-venta">▶ <span class="lg">Ver demo</span><span class="sm">Demo</span></NuxtLink>
        <button type="button" class="btn btn-primary" @click="abrir"><span class="lg">Cotizar proyecto</span><span class="sm">Cotizar</span></button>
      </div>
    </div>
  </nav>
</template>
