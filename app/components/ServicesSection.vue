<script setup lang="ts">
const services = [
  {
    tag: '/web', title: 'Sitios web', time: '2 a 4 semanas',
    items: ['Landing pages y sitios corporativos', 'Tiendas online con Webpay, Mercado Pago o Flow', 'Optimizado para Google y celulares', 'Panel para que edites tus textos y productos']
  },
  {
    tag: '/app', title: 'Aplicaciones', time: '6 a 12 semanas',
    items: ['Apps para iOS y Android con una sola base de código', 'Reservas, pedidos, inventario o fuerza de venta', 'Inicio de sesión, notificaciones y pagos', 'Publicación en App Store y Google Play']
  },
  {
    tag: '/dashboard', title: 'Dashboards', time: '3 a 6 semanas',
    items: ['Ventas, stock y finanzas en un solo panel', 'Conexión a Excel, Google Sheets, tu ERP o base de datos', 'Indicadores que se actualizan solos', 'Accesos por usuario y reportes exportables']
  }
]
</script>

<template>
  <section id="servicios">
    <div class="wrap">
      <SectionHead
        label="Servicios"
        title="Tres formas de llevar tu negocio a la pantalla"
        text="Cada proyecto parte de lo que necesitas resolver: vender más, ordenar tu operación o ver tus números con claridad."
      />
      <div class="services">
        <article v-for="s in services" :key="s.tag" class="svc">
          <span class="tag">{{ s.tag }}</span>
          <h3>{{ s.title }}</h3>
          <ul>
            <li v-for="i in s.items" :key="i">{{ i }}</li>
          </ul>
          <div class="spec"><span>Plazo típico</span><b>{{ s.time }}</b></div>
        </article>
      </div>
    </div>
  </section>
</template>
