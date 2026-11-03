<script setup lang="ts">
const steps = [
  { title: 'Diagnóstico', text: 'Conversamos sobre tu negocio, tus clientes y qué quieres lograr. Sin costo y sin compromiso.', when: 'Semana 1' },
  { title: 'Prototipo', text: 'Te muestro cómo se verá antes de programar nada, y lo ajustamos hasta que te guste.', when: 'Semana 1–2' },
  { title: 'Desarrollo', text: 'Cada semana te envío un enlace para que pruebes los avances y me des tu opinión.', when: 'Según alcance' },
  { title: 'Lanzamiento', text: 'Lo dejo funcionando, enseño a tu equipo a usarlo y te acompaño 30 días sin costo extra.', when: 'Entrega' }
]
</script>

<template>
  <section id="proceso">
    <div class="wrap">
      <SectionHead
        label="Proceso"
        title="Cómo trabajamos, paso a paso"
        text="Sin sorpresas ni letra chica: ves avances cada semana y nada avanza sin tu aprobación."
      />
      <div class="steps">
        <div v-for="s in steps" :key="s.title" class="step">
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <span class="when">{{ s.when }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
