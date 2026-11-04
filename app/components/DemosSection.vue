<script setup lang="ts">
// Vista previa de las demos con inclinación 3D que sigue al mouse.
// Las imágenes salen de las demos reales: se regeneran con scripts/capturar-demos.mjs
const demos = [
  { to: '/demo-punto-de-venta', img: 'demos/pos.webp', w: 1128, h: 710, tipo: 'Punto de venta', titulo: 'Caja de almacén', texto: 'Cobra con lector, entrega vuelto, emite boleta y revisa el stock y el cierre de caja.', cls: 'is-pos' },
  { to: '/demo-app-reservas', img: 'demos/app.webp', w: 360, h: 740, tipo: 'App de reservas', titulo: 'Barbería', texto: 'Reserva una hora como cliente y mira cómo le llega al dueño en su agenda.', cls: 'is-app' }
]
const base = useRuntimeConfig().app.baseURL

const reducir = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
function inclinar(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || reducir) return
  const card = e.currentTarget as HTMLElement
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
  card.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
}
function soltar(e: PointerEvent) {
  const card = e.currentTarget as HTMLElement
  card.style.removeProperty('--rx')
  card.style.removeProperty('--ry')
}
</script>

<template>
  <section id="demos">
    <div class="wrap">
      <SectionHead
        label="Demos"
        title="Pruébalo tú mismo, sin registrarte"
        text="No son imágenes: son sistemas funcionando. Ábrelos en tu celular o computador y úsalos como lo haría tu negocio."
      />
      <div class="demos">
        <NuxtLink
          v-for="d in demos" :key="d.to" v-spotlight :to="d.to" class="demo-card" :class="d.cls"
          @pointermove="inclinar" @pointerleave="soltar"
        >
          <div class="demo-stage">
            <div class="demo-tilt">
              <img :src="`${base}${d.img}`" :width="d.w" :height="d.h" :alt="`Vista previa de la demo de ${d.tipo.toLowerCase()}`" loading="lazy" decoding="async">
            </div>
            <span class="live"><i aria-hidden="true"></i>En vivo · Toca para probar</span>
          </div>
          <div class="demo-info">
            <span class="tag">{{ d.tipo }}</span>
            <h3>{{ d.titulo }}</h3>
            <p>{{ d.texto }}</p>
            <span class="demo-go">Probar la demo →</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
