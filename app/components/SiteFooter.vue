<script setup lang="ts">
import { rubros } from '~~/shared/rubros'
</script>

<template>
  <footer>
    <div class="wrap">
      <span>© 2026 Plano Digital · Desarrollo web, apps y puntos de venta</span>
      <nav class="foot-links" aria-label="Soluciones por rubro">
        <NuxtLink v-for="r in rubros" :key="r.slug" :to="`/${r.slug}`">{{ r.nombre }}</NuxtLink>
      </nav>
      <span>Hecho a medida en Chile</span>
    </div>
  </footer>
</template>
