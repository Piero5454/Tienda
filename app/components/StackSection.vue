<script setup lang="ts">
const stack = ['React', 'Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Tailwind', 'Google Sheets API', 'Webpay', 'Vercel']
</script>

<template>
  <section>
    <div class="wrap">
      <SectionHead
        label="Tecnología"
        title="Tecnología moderna y confiable"
        text="No necesitas saber de programación: elijo por ti las herramientas para que tu proyecto sea rápido, seguro y fácil de mantener en el tiempo."
      />
      <div class="stack">
        <span v-for="t in stack" :key="t">{{ t }}</span>
      </div>
    </div>
  </section>
</template>
