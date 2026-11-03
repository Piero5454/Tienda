<script setup lang="ts">
const stack = ['React', 'Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Tailwind', 'Google Sheets API', 'Webpay', 'Vercel']
</script>

<template>
  <section>
    <div class="wrap">
      <SectionHead
        label="Tecnología"
        title="Herramientas modernas y probadas"
        text="Elijo la tecnología según tu proyecto, priorizando que sea rápida, segura y fácil de mantener."
      />
      <div class="stack">
        <span v-for="t in stack" :key="t">{{ t }}</span>
      </div>
    </div>
  </section>
</template>
