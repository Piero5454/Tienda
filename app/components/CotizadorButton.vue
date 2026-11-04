<script setup lang="ts">
// Botón flotante (abajo a la izquierda) que abre el cotizador.
// No se muestra en las demos, que tienen sus propios controles abajo.
const route = useRoute()
const { abrir } = useCotizador()
const visible = computed(() => !route.path.startsWith('/demo-'))
</script>

<template>
  <button v-if="visible" type="button" class="cot-float" @click="abrir">
    <span class="cot-float-ico" aria-hidden="true">$</span>
    <span>Cotiza en 1 minuto</span>
  </button>
</template>
