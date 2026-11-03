// https://nuxt.com/docs/api/configuration/nuxt-config

// URL pública del sitio (para Google y vistas previas al compartir).
// Render la entrega en RENDER_EXTERNAL_URL; con dominio propio, define NUXT_PUBLIC_SITE_URL.
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '')
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const abs = (path: string) => `${siteUrl}${baseURL}${path}`

const title = 'Plano Digital · Páginas web, apps y puntos de venta para pymes en Chile'
const description = 'Páginas web, tiendas online, apps y sistemas de caja (punto de venta) hechos a medida para almacenes, minimarkets y pequeños negocios en Chile. Precio cerrado y respuesta en 24 horas.'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/styles.css'],
  app: {
    // En GitHub Pages el sitio vive en /Tienda/ (se define con NUXT_APP_BASE_URL al generar)
    baseURL,
    head: {
      htmlAttrs: { lang: 'es-CL' },
      title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: description },
        { name: 'theme-color', content: '#FAF7F2' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_CL' },
        { property: 'og:site_name', content: 'Plano Digital' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: abs('og.png') },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Plano Digital: páginas web, apps y puntos de venta para pequeños negocios en Chile' },
        ...(siteUrl ? [{ property: 'og:url', content: abs('') }] : []),
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        ...(siteUrl ? [{ rel: 'canonical', href: abs('') }] : []),
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Plano Digital',
            description,
            ...(siteUrl ? { url: abs(''), image: abs('og.png') } : {}),
            areaServed: { '@type': 'Country', name: 'Chile' },
            priceRange: '$$',
            knowsAbout: ['Desarrollo web', 'Tiendas online', 'Aplicaciones móviles', 'Sistemas de punto de venta']
          })
        }
      ]
    }
  }
})
