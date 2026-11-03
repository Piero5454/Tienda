<script setup lang="ts">
const steps = [
  { title: 'Diagnóstico', text: 'Una reunión para entender tu negocio, tus usuarios y qué debe resolver el proyecto.', when: 'Semana 1' },
  { title: 'Prototipo', text: 'Diseño navegable de las pantallas principales. Lo ajustamos hasta que lo apruebes.', when: 'Semana 1–2' },
  { title: 'Desarrollo', text: 'Programación con entregas semanales en un enlace de prueba que puedes revisar.', when: 'Según alcance' },
  { title: 'Lanzamiento', text: 'Publicación, capacitación para tu equipo y 30 días de soporte incluidos.', when: 'Entrega' }
]
</script>

<template>
  <section id="proceso">
    <div class="wrap">
      <SectionHead
        label="Proceso"
        title="Cómo trabajamos, paso a paso"
        text="Ves avances cada semana y apruebas cada etapa antes de seguir."
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
