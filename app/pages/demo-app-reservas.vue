<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public
const base = useRuntimeConfig().app.baseURL
const url = siteUrl ? `${siteUrl}${base}demo-app-reservas` : ''
const title = 'Demo gratis de app de reservas para peluquerías y barberías · Plano Digital'
const description = 'Prueba cómo funciona una app de reserva de horas para tu peluquería o barbería: el cliente elige servicio, profesional y hora, recibe un recordatorio y tú ves tu agenda en el celular.'

useSeoMeta({ title, description, ogTitle: title, ogDescription: description, ...(url ? { ogUrl: url } : {}) })
useHead({ link: url ? [{ rel: 'canonical', href: url, key: 'canonical' }] : [] })

const vista = ref<'cliente' | 'negocio'>('cliente')
const demo = ref<{ reiniciar: () => void } | null>(null)
const { $evento } = useNuxtApp()
let contado = false
const alReservar = () => { if (!contado) { $evento?.('demo-reserva'); contado = true } }
</script>

<template>
  <div>
    <SiteNav />

    <header class="demo-head">
      <div class="wrap">
        <DemoSwitch />
        <p class="label" style="margin-top:28px">Demo · App de reservas</p>
        <h1>Prueba una app de reservas, como la vería tu cliente</h1>
        <p class="lede">Reserva una hora en una barbería de ejemplo y después mira cómo le aparece al dueño en su agenda. Es una demostración: no guarda datos y se reinicia al recargar la página.</p>
      </div>
    </header>

    <section class="demo-app" aria-label="Demo de la app de reservas">
      <div class="wrap app-demo-layout">
        <ClientOnly>
          <AppDemo ref="demo" v-model:vista="vista" @reservado="alReservar" />
          <template #fallback>
            <div class="demo-loading" style="width:min(360px,100%); margin-inline:auto; aspect-ratio:9/18.5">Cargando la app…</div>
          </template>
        </ClientOnly>

        <div class="app-demo-side">
          <div class="app-view-toggle" role="tablist" aria-label="Vista">
            <button role="tab" type="button" :aria-selected="vista === 'cliente'" @click="vista = 'cliente'">Vista del cliente</button>
            <button role="tab" type="button" :aria-selected="vista === 'negocio'" @click="vista = 'negocio'">Vista del negocio</button>
          </div>
          <ol class="demo-steps demo-steps-col">
            <li>Elige un <b>servicio</b>, un <b>barbero</b> y una <b>hora libre</b></li>
            <li>Confirma: a los segundos te llega un <b>recordatorio</b></li>
            <li>Cambia a <b>Vista del negocio</b> y busca tu cita en la agenda</li>
          </ol>
          <ul class="app-demo-points">
            <li>Funciona las 24 horas, sin contestar el teléfono</li>
            <li>Recordatorios automáticos: menos clientes que no llegan</li>
            <li>Agenda por profesional e ingresos del día en el celular</li>
            <li>Con tu marca, tus servicios y tus precios</li>
          </ul>
          <button type="button" class="pos-reset" @click="demo?.reiniciar()">Reiniciar demo</button>
        </div>
      </div>
    </section>

    <section class="demo-cta">
      <div class="wrap">
        <div>
          <h2>¿Te gustaría algo así para tu negocio?</h2>
          <p>Sirve para peluquerías, barberías, centros de estética, talleres, consultas y cualquier negocio que trabaje con horas. Puede partir como página web con reservas y crecer a app propia.</p>
        </div>
        <div class="cta">
          <a class="btn btn-primary" href="#contacto">Cotizar mi sistema de reservas →</a>
          <NuxtLink class="btn btn-ghost" to="/peluquerias">Ver qué incluye</NuxtLink>
        </div>
      </div>
    </section>

    <ContactSection tipo-inicial="App" pagina="Demo app de reservas" mensaje-ejemplo="Ej: Probé la demo y quiero algo así para mi barbería. Somos 3 barberos y atendemos de lunes a sábado." />
    <SiteFooter />
  </div>
</template>
