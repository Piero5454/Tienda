<script setup lang="ts">
const faqs = [
  { q: '¿Cuánto cuesta un proyecto?', a: 'Depende de lo que necesites. Después de la primera conversación te envío un presupuesto cerrado en pesos, que detalla qué incluye y qué no. El precio no cambia a mitad de camino y puedes pagar por etapas.' },
  { q: '¿El sitio o la app quedan a mi nombre?', a: 'Sí, todo es tuyo: el dominio, el código y las cuentas quedan a tu nombre. Si algún día quieres trabajar con otra persona, te llevas todo sin problemas.' },
  { q: '¿Qué pasa después de la entrega?', a: 'Durante 30 días corrijo cualquier detalle sin costo. Después puedes contratar un plan mensual de mantención o pedirme cambios solo cuando los necesites.' },
  { q: '¿El punto de venta funciona con lo que ya tengo?', a: 'En la mayoría de los casos, sí. Funciona en computador, tablet o celular, y se conecta con lector de código de barras, impresora de boletas y máquina de pago. Si tienes tus productos en Excel, los cargo yo.' }
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
