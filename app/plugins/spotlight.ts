// v-spotlight: guarda la posición del mouse en --mx / --my para el brillo de las tarjetas (.spot)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('spotlight', {
    mounted(el: HTMLElement) {
      el.classList.add('spot')
      const mover = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      el.addEventListener('pointermove', mover)
      ;(el as HTMLElement & { _spot?: (e: PointerEvent) => void })._spot = mover
    },
    unmounted(el: HTMLElement & { _spot?: (e: PointerEvent) => void }) {
      if (el._spot) el.removeEventListener('pointermove', el._spot)
    },
    getSSRProps: () => ({ class: 'spot' })
  })
})
