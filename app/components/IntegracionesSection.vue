<script setup lang="ts">
// Herramientas conocidas por los clientes con las que se conecta cada proyecto.
// Solo poner aquí lo que realmente se ofrece (coincide con servicios, rubros y ejemplos).
const integraciones = [
  { i: '💳', t: 'Webpay', d: 'Tus clientes pagan con débito o crédito en tu tienda online.' },
  { i: '🤝', t: 'Mercado Pago y Flow', d: 'Otras formas de pago en línea, la que más te acomode.' },
  { i: '💬', t: 'WhatsApp', d: 'Botón para que te escriban directo, con el mensaje ya escrito.' },
  { i: '📍', t: 'Google Maps', d: 'Tu negocio listo para aparecer en el mapa y en búsquedas de tu comuna.' },
  { i: '📸', t: 'Instagram', d: 'Tus redes enlazadas para que vean tus productos y trabajos.' },
  { i: '📊', t: 'Excel', d: 'Cargas tus productos desde una planilla, sin escribirlos uno por uno.' },
  { i: '🔎', t: 'Lector de códigos', d: 'En la caja, pasas el producto por el lector y se agrega solo.' },
  { i: '📱', t: 'Tu celular', d: 'Revisas ventas, pedidos y reservas desde el teléfono, donde estés.' }
]
</script>

<template>
  <section>
    <div class="wrap">
      <SectionHead
        label="Integraciones"
        title="Funciona con lo que ya usas"
        text="Conecto tu proyecto con las herramientas que tú y tus clientes ya conocen, sin cambiar tu forma de trabajar."
      />
      <ul class="integ">
        <li v-for="x in integraciones" :key="x.t">
          <span class="integ-i" aria-hidden="true">{{ x.i }}</span>
          <b>{{ x.t }}</b>
          <span>{{ x.d }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
