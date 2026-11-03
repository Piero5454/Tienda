// https://nuxt.com/docs/api/configuration/nuxt-config
import { rubros } from './shared/rubros'

// URL pública del sitio (para Google y vistas previas al compartir).
// Render la entrega en RENDER_EXTERNAL_URL; con dominio propio, define NUXT_PUBLIC_SITE_URL.
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '')
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const abs = (path: string) => `${siteUrl}${baseURL}${path}`

const title = 'Plano Digital · Páginas web, apps y puntos de venta para pymes en Chile'
const description = 'Páginas web, tiendas online, apps y sistemas de caja (punto de venta) hechos a medida para almacenes, minimarkets y pequeños negocios en Chile. Precio cerrado y respuesta en 24 horas.'

// Código de verificación de Google Search Console (método "etiqueta HTML").
// Se copia solo el valor de content="..." en la variable de entorno en Render.
const googleVerification = process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ''

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/styles.css'],
  runtimeConfig: { public: { siteUrl } },
  nitro: { prerender: { routes: rubros.map(r => `/${r.slug}`) } },
  hooks: {
    // Al generar el sitio, crea sitemap.xml y apunta robots.txt hacia él
    // (requiere conocer la URL pública: RENDER_EXTERNAL_URL o NUXT_PUBLIC_SITE_URL).
    async 'nitro:build:public-assets'(nitro) {
      if (!siteUrl) return
      const { writeFile } = await import('node:fs/promises')
      const { join } = await import('node:path')
      const dir = nitro.options.output.publicDir
      const hoy = new Date().toISOString().slice(0, 10)
      const urls = ['', ...rubros.map(r => r.slug)]
        .map(p => `  <url><loc>${abs(p)}</loc><lastmod>${hoy}</lastmod></url>`).join('\n')
      await writeFile(join(dir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      await writeFile(join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`)
    }
  },
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
        { name: 'twitter:card', content: 'summary_large_image' },
        ...(googleVerification ? [{ name: 'google-site-verification', content: googleVerification }] : [])
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        ...(siteUrl ? [{ rel: 'canonical', href: abs(''), key: 'canonical' }] : []),
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
