<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public
const base = useRuntimeConfig().app.baseURL
const url = siteUrl ? `${siteUrl}${base}demo-punto-de-venta` : ''
const title = 'Demo gratis de punto de venta para almacenes · Prueba la caja · Plano Digital'
const description = 'Prueba en tu celular o computador cómo funciona un sistema de caja para almacén: cobro con lector de código de barras, boleta, vuelto, stock que se descuenta solo y cierre de caja.'

useSeoMeta({ title, description, ogTitle: title, ogDescription: description, ...(url ? { ogUrl: url } : {}) })
useHead({ link: url ? [{ rel: 'canonical', href: url, key: 'canonical' }] : [] })
</script>

<template>
  <div>
    <SiteNav />

    <header class="demo-head">
      <div class="wrap">
        <DemoSwitch />
        <p class="label" style="margin-top:28px">Demo · Punto de venta</p>
        <h1>Prueba una caja de almacén, aquí mismo</h1>
        <p class="lede">Agrega productos, cobra en efectivo o con tarjeta y mira cómo se descuenta el stock y cómo queda el cierre de caja. Es una demostración: no cobra nada y se reinicia al recargar la página.</p>
        <ol class="demo-steps">
          <li>Toca productos o usa <b>Simular lector</b></li>
          <li>Cobra en <b>Efectivo</b> y elige con cuánto paga</li>
          <li>Revisa las pestañas <b>Stock</b> y <b>Cierre de caja</b></li>
        </ol>
      </div>
    </header>

    <section class="demo-app" aria-label="Demo del punto de venta">
      <div class="wrap">
        <ClientOnly>
          <PosDemo />
          <template #fallback>
            <div class="demo-loading">Cargando la caja…</div>
          </template>
        </ClientOnly>
        <p class="price-note">En tu negocio, la caja se adapta a tus productos y funciona con lector de código de barras, impresora de boletas y máquina de pago (Transbank, Mercado Pago o SumUp). Boleta electrónica válida ante el SII mediante un proveedor autorizado.</p>
      </div>
    </section>

    <section class="demo-cta">
      <div class="wrap">
        <div>
          <h2>¿Te gustaría algo así para tu negocio?</h2>
          <p>Lo hago a la medida de tu almacén, minimarket, botillería o cafetería, con tus productos cargados. Desde $450.000 + IVA, con precio cerrado.</p>
        </div>
        <div class="cta">
          <a class="btn btn-primary" href="#contacto">Cotizar mi punto de venta →</a>
          <NuxtLink class="btn btn-ghost" to="/almacenes">Ver qué incluye</NuxtLink>
        </div>
      </div>
    </section>

    <ContactSection tipo-inicial="Punto de venta" pagina="Demo punto de venta" mensaje-ejemplo="Ej: Probé la demo y quiero algo así para mi almacén. Tengo unos 500 productos y una sola caja." />
    <SiteFooter />
  </div>
</template>
