// Hace aparecer suavemente secciones y tarjetas al bajar por la página.
// Solo afecta a lo que está fuera de la pantalla al cargar (nada visible parpadea),
// no hace nada si la persona pidió "reducir movimiento" y, sin JavaScript, todo se ve normal.
const SELECTOR = [
  '.sec-head', '.svc', '.price-note', '.demo-card', '.ex', '.step',
  '.about-id', '.about-text', '.about-values li', '.integ li', '.faq details', '.contact > *'
].join(',')

export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) return

  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue
      const el = e.target as HTMLElement
      obs.unobserve(el)
      el.classList.add('rv-in')
      // Al terminar, se quitan las clases para no interferir con otros efectos de la tarjeta
      const demora = parseInt(el.style.getPropertyValue('--rv-d')) || 0
      setTimeout(() => { el.classList.remove('rv', 'rv-in'); el.style.removeProperty('--rv-d') }, 750 + demora)
    }
  }, { rootMargin: '0px 0px -8% 0px' })

  const preparar = () => requestAnimationFrame(() => {
    const alto = window.innerHeight
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      if (el.classList.contains('rv') || el.getBoundingClientRect().top < alto) return
      // Las tarjetas de una misma fila aparecen una tras otra
      const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0
      el.style.setProperty('--rv-d', `${Math.min(i, 5) * 80}ms`)
      el.classList.add('rv')
      obs.observe(el)
    })
  })

  nuxtApp.hook('app:mounted', preparar)
  nuxtApp.hook('page:finish', preparar)
})
