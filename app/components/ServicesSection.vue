<script setup lang="ts">
// Precios de referencia en CLP, sin IVA. Ajústalos a tus valores reales.
const services = [
  {
    tag: '/web', title: 'Sitios web', time: '2 a 4 semanas', price: '$250.000',
    items: ['Páginas para que tus clientes te encuentren en Google', 'Tiendas online con pago por Webpay, Mercado Pago o Flow', 'Se ven y cargan rápido en cualquier celular', 'Tú mismo cambias textos, fotos, precios y productos']
  },
  {
    tag: '/app', title: 'Aplicaciones', time: '6 a 12 semanas', price: '$1.800.000',
    items: ['Una sola app para iPhone y Android', 'Pedidos, reservas, inventario o rutas de reparto', 'Avisos al celular, cuentas de usuario y pagos', 'Me encargo de publicarla en App Store y Google Play']
  },
  {
    tag: '/pos', title: 'Puntos de venta', time: '2 a 5 semanas', price: '$450.000',
    items: ['Caja fácil de usar para almacenes, minimarkets, cafeterías y ferias', 'Boleta electrónica y pago con tarjeta (Transbank, Mercado Pago o SumUp)', 'Stock al día, con aviso cuando un producto se está acabando', 'Cierre de caja y resumen de ventas en un clic']
  }
]
</script>

<template>
  <section id="servicios">
    <div class="wrap">
      <SectionHead
        label="Servicios"
        title="Lo que puedo hacer por tu negocio"
        text="Partimos por lo que necesitas resolver, no por la tecnología: que te encuentren en internet, que tus clientes compren desde el celular o que cobrar en la caja sea rápido y sin errores."
      />
      <div class="services">
        <article v-for="s in services" :key="s.tag" class="svc">
          <span class="tag">{{ s.tag }}</span>
          <h3>{{ s.title }}</h3>
          <p class="price"><small>Desde</small> {{ s.price }} <small>+ IVA</small></p>
          <ul>
            <li v-for="i in s.items" :key="i">{{ i }}</li>
          </ul>
          <div class="spec"><span>Plazo típico</span><b>{{ s.time }}</b></div>
        </article>
      </div>
      <p class="price-note">Precios de referencia. El valor final depende de lo que necesites y te lo envío cerrado, por escrito, antes de empezar.</p>
    </div>
  </section>
</template>
