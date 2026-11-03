<script setup lang="ts">
// Ejemplos ilustrativos de proyectos típicos (no son clientes reales).
// Cuando tengas trabajos propios, reemplázalos por casos reales con nombre y resultados.
const examples = [
  {
    tipo: 'Punto de venta',
    negocio: 'Almacén de barrio',
    problema: 'Las ventas se anotan en un cuaderno, no se sabe qué productos faltan y cuadrar la caja toma media hora cada noche.',
    solucion: 'Caja en un tablet con lector de código de barras, boleta y pago con tarjeta, stock que se descuenta solo y cierre de caja en un clic.',
    incluye: ['Carga de productos desde Excel', 'Aviso de productos por agotarse', 'Resumen de ventas diario'],
    plazo: '3 semanas',
    rubro: 'almacenes',
    enlace: 'Ver más para almacenes'
  },
  {
    tipo: 'Sitio web',
    negocio: 'Pastelería con pedidos',
    problema: 'Los pedidos llegan por WhatsApp e Instagram, se pierden mensajes y hay que confirmar cada pago a mano.',
    solucion: 'Tienda online con catálogo, pago con Webpay y elección de fecha de retiro o despacho. Cada pedido llega ordenado a un solo lugar.',
    incluye: ['Catálogo editable por la dueña', 'Pago online y confirmación automática', 'Aparece en Google Maps y búsquedas locales'],
    plazo: '4 semanas',
    rubro: 'pastelerias',
    enlace: 'Ver más para pastelerías'
  },
  {
    tipo: 'App',
    negocio: 'Peluquería o taller',
    problema: 'Las horas se agendan por teléfono, hay clientes que no llegan y nadie recuerda quién tiene hora mañana.',
    solucion: 'App de reservas donde el cliente elige servicio y hora, recibe un recordatorio y el negocio ve su agenda del día en el celular.',
    incluye: ['Recordatorio automático al cliente', 'Agenda por profesional', 'Historial de cada cliente'],
    plazo: '8 semanas',
    rubro: 'peluquerias',
    enlace: 'Ver más para peluquerías'
  }
]
</script>

<template>
  <section id="ejemplos">
    <div class="wrap">
      <SectionHead
        label="Ejemplos"
        title="Así puede quedar tu proyecto"
        text="Tres casos típicos de pequeños negocios: el problema de todos los días y cómo se resuelve con una herramienta hecha a medida."
      />
      <div class="examples">
        <article v-for="e in examples" :key="e.negocio" class="ex">
          <span class="tag">{{ e.tipo }}</span>
          <h3>{{ e.negocio }}</h3>
          <div class="ex-block">
            <span class="label">Antes</span>
            <p>{{ e.problema }}</p>
          </div>
          <div class="ex-block">
            <span class="label">La solución</span>
            <p>{{ e.solucion }}</p>
          </div>
          <ul>
            <li v-for="i in e.incluye" :key="i">{{ i }}</li>
          </ul>
          <div class="spec"><span>Plazo estimado</span><b>{{ e.plazo }}</b></div>
          <NuxtLink class="ex-more" :to="`/${e.rubro}`">{{ e.enlace }} →</NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
