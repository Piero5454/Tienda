// Contador de visitas con GoatCounter (gratis y sin cookies).
// El código de la cuenta se define en nuxt.config.ts (goatcounter) o con la variable
// NUXT_PUBLIC_GOATCOUNTER en Render. Si está vacío, no se carga nada.

declare global {
  interface Window { goatcounter?: { count?: (o: Record<string, unknown>) => void; no_onload?: boolean } }
}

export default defineNuxtPlugin(() => {
  const code = useRuntimeConfig().public.goatcounter
  if (!code || location.hostname === 'localhost' || location.hostname === '127.0.0.1') return

  // Se cuenta cada cambio de página a mano, porque el sitio navega sin recargar
  window.goatcounter = { no_onload: true }
  const pendientes: Record<string, unknown>[] = []
  const contar = (o: Record<string, unknown>) => {
    const gc = window.goatcounter
    if (gc?.count) gc.count(o)
    else pendientes.push(o)
  }

  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`
  s.onload = () => pendientes.splice(0).forEach(o => window.goatcounter?.count?.(o))
  document.head.appendChild(s)

  const router = useRouter()
  const nuxtApp = useNuxtApp()
  let ultima = ''
  // Se espera a que la página nueva termine de cargar para enviar su título correcto
  const vista = () => setTimeout(() => {
    const path = router.currentRoute.value.path
    if (path === ultima) return
    ultima = path
    contar({ path, title: document.title })
  }, 150)
  router.isReady().then(vista)
  nuxtApp.hook('page:finish', vista)

  // Eventos: aparecen en el panel como "evento-..." junto a la página donde ocurrieron
  return {
    provide: {
      evento: (nombre: string) => contar({ path: `evento-${nombre}`, title: router.currentRoute.value.path, event: true })
    }
  }
})
