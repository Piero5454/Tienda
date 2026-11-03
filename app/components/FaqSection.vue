<script setup lang="ts">
const faqs = [
  { q: '¿Cuánto cuesta un proyecto?', a: 'Depende del alcance. Después de la primera reunión te envío un presupuesto cerrado en pesos chilenos, con lo que incluye y lo que no. Puedes pagar por etapas.' },
  { q: '¿El sitio o la app quedan a mi nombre?', a: 'Sí. El dominio, el código y las cuentas de hosting quedan a tu nombre. Si un día quieres cambiar de proveedor, te llevas todo.' },
  { q: '¿Qué pasa después de la entrega?', a: 'Incluyo 30 días de soporte para corregir cualquier detalle. Luego puedes contratar un plan mensual de mantención o pedir cambios puntuales.' },
  { q: '¿El punto de venta funciona con lo que ya tengo?', a: 'Sí. Funciona en un computador, tablet o celular, y se conecta con lector de código de barras, impresora de boletas y tu máquina de pago. Si tienes tus productos en Excel, los cargo por ti.' }
]
</script>

<template>
  <section id="preguntas">
    <div class="wrap">
      <SectionHead label="Preguntas" title="Lo que más me preguntan" />
      <div class="faq">
        <details v-for="(f, i) in faqs" :key="f.q" :open="i === 0">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
