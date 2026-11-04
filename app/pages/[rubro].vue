<script setup lang="ts">
import { rubros, rubroPorSlug } from '~~/shared/rubros'

const route = useRoute()
const r = rubroPorSlug(String(route.params.rubro))
if (!r) throw createError({ statusCode: 404, statusMessage: 'Página no encontrada', fatal: true })

const { siteUrl } = useRuntimeConfig().public
const base = useRuntimeConfig().app.baseURL
const url = siteUrl ? `${siteUrl}${base}${r.slug}` : ''

useSeoMeta({
  title: r.seoTitle,
  description: r.seoDescription,
  ogTitle: r.seoTitle,
  ogDescription: r.seoDescription,
  ...(url ? { ogUrl: url } : {})
})
useHead({
  link: url ? [{ rel: 'canonical', href: url, key: 'canonical' }] : [],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${r.solucion} para ${r.nombre.toLowerCase()}`,
      description: r.seoDescription,
      areaServed: { '@type': 'Country', name: 'Chile' },
      provider: { '@type': 'ProfessionalService', name: 'Plano Digital', ...(siteUrl ? { url: `${siteUrl}${base}` } : {}) },
      ...(url ? { url } : {})
    })
  }]
})

const otros = rubros.filter(o => o.slug !== r.slug)
</script>

<template>
  <div>
    <SiteNav />

    <header class="hero" id="inicio">
      <div class="wrap">
        <div>
          <p class="label">{{ r.label }}</p>
          <h1 style="margin-top:16px">{{ r.h1 }} <em>{{ r.h1Destacado }}</em>.</h1>
          <p class="lede">{{ r.lede }}</p>
          <div class="cta">
            <a class="btn btn-primary" href="#contacto">Cotizar para mi negocio →</a>
            <NuxtLink v-if="r.slug === 'almacenes'" class="btn btn-primary" to="/demo-punto-de-venta">▶ Probar la demo</NuxtLink>
            <NuxtLink v-else-if="r.slug === 'peluquerias'" class="btn btn-primary" to="/demo-app-reservas">▶ Probar la demo</NuxtLink>
            <a v-else class="btn btn-ghost" href="#incluye">Ver qué incluye</a>
          </div>
          <div class="meta">
            <span>Respuesta en 24 h hábiles</span>
            <span>Primera reunión sin costo</span>
            <span>Código y dominio a tu nombre</span>
          </div>
        </div>
        <article class="svc rubro-card">
          <span class="tag">{{ r.solucion }}</span>
          <h2 class="rubro-card-title">Para {{ r.nombre.toLowerCase() }}</h2>
          <p v-if="r.precio" class="price"><small>Desde</small> {{ r.precio }} <small>+ IVA</small></p>
          <p v-else class="price">A cotizar</p>
          <ul>
            <li v-for="i in r.resumen" :key="i">{{ i }}</li>
          </ul>
          <div class="spec"><span>Plazo típico</span><b>{{ r.plazo }}</b></div>
        </article>
      </div>
    </header>

    <section id="problemas">
      <div class="wrap">
        <SectionHead label="El día a día" title="¿Te suena conocido?" />
        <div class="pains">
          <div v-for="d in r.dolores" :key="d.t" class="pain">
            <h3>{{ d.t }}</h3>
            <p>{{ d.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="incluye">
      <div class="wrap">
        <SectionHead
          label="Qué incluye"
          title="Hecho a la medida de tu negocio"
          text="Esto es lo que suele necesitar un negocio como el tuyo. En la primera conversación vemos qué te sirve, qué sobra y qué falta."
        />
        <div class="feats">
          <div v-for="f in r.incluye" :key="f.t" class="feat">
            <h3>{{ f.t }}</h3>
            <p>{{ f.d }}</p>
          </div>
        </div>
        <p class="price-note">Precio de referencia. El valor final depende de lo que necesites y te lo envío cerrado, por escrito, antes de empezar.</p>
      </div>
    </section>

    <ProcessSection />
    <FaqSection :items="r.faqs" />
    <ContactSection :tipo-inicial="r.tipo" :pagina="r.nombre" :mensaje-ejemplo="r.mensajeEjemplo" />

    <section id="otros-rubros">
      <div class="wrap">
        <SectionHead label="Otros rubros" title="También trabajo con" />
        <div class="rubro-links">
          <NuxtLink v-for="o in otros" :key="o.slug" :to="`/${o.slug}`" class="btn btn-ghost">{{ o.nombre }} →</NuxtLink>
          <NuxtLink to="/" class="btn btn-ghost">Todos los servicios →</NuxtLink>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>
