// Enlaces a secciones (#contacto, #servicios…): baja suavemente hasta la sección
// sin agregar "#seccion" a la dirección del navegador.

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const limpiar = () => {
    if (!location.hash) return
    history.replaceState(history.state, '', location.pathname + location.search)
  }
  const irA = (hash: string) => {
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!el) return false
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }

  // Clic en un enlace a una sección de la misma página
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null
    if (!a || a.target === '_blank' || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return
    if (irA(a.hash)) {
      e.preventDefault()
      limpiar()
    }
  }, true)

  // Si se cambia el # a mano estando en la misma página
  window.addEventListener('hashchange', () => { if (irA(location.hash)) setTimeout(limpiar, 50) })

  // Llegando desde otra página (p. ej. /almacenes → Servicios) o con un enlace compartido con #
  const limpiarDespues = () => setTimeout(limpiar, 800)
  nuxtApp.hook('app:mounted', limpiarDespues)
  router.afterEach((to) => { if (to.hash) nuxtApp.hooks.hookOnce('page:finish', limpiarDespues) })
})
