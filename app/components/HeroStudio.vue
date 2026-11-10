<script setup lang="ts">
// Maqueta animada de la portada: muestra en miniatura una tienda web, una app de reservas
// y una caja de almacén funcionando solas. Rota entre las tres hasta que la persona elige una.
// Con "reducir movimiento" activado queda quieta en un estado representativo.
type Kind = 'web' | 'app' | 'pos'

const tabs: { k: Kind; label: string; to: string; cta: string }[] = [
  { k: 'web', label: 'Web', to: '/pastelerias', cta: 'Ver la solución para pastelerías →' },
  { k: 'app', label: 'App', to: '/demo-app-reservas', cta: '▶ Probar la app de reservas' },
  { k: 'pos', label: 'Punto de venta', to: '/demo-punto-de-venta', cta: '▶ Probar la caja de almacén' }
]

// Cantidad de pasos de cada animación y paso que se muestra cuando no hay movimiento
const LARGO: Record<Kind, number> = { web: 10, app: 10, pos: 10 }
const QUIETO: Record<Kind, number> = { web: 5, app: 7, pos: 5 }
const TICK = 850

const clp = (n: number) => '$' + n.toLocaleString('es-CL')

const active = ref<Kind>('web')
const step = ref(QUIETO.web)
const autoRotar = ref(true)

// ── Web: tienda de pastelería ──
const tortas = [
  { n: 'Torta mil hojas', p: 18990, e: '🎂', c: 'var(--signal)' },
  { n: 'Cupcakes x6', p: 7500, e: '🧁', c: '#C9A0DC' },
  { n: 'Kuchen de nuez', p: 9990, e: '🥧', c: '#E3B04B' }
]
const web = computed(() => {
  const s = active.value === 'web' ? step.value : QUIETO.web
  const agregados = s >= 3 ? [0, 2] : s >= 1 ? [0] : []
  return {
    agregados,
    toque: s === 1 ? 0 : s === 3 ? 2 : -1,
    total: agregados.reduce((t, i) => t + tortas[i]!.p, 0),
    carro: s >= 4 && s < 7,
    pagando: s === 6,
    listo: s >= 7 && s <= 8
  }
})

// ── App: reservas de barbería (vista cliente + agenda del negocio) ──
const horas = [
  { h: '10:00', libre: false }, { h: '11:30', libre: true }, { h: '12:30', libre: false },
  { h: '15:00', libre: true }, { h: '16:30', libre: true }, { h: '18:00', libre: false }
]
const app = computed(() => {
  const s = active.value === 'app' ? step.value : QUIETO.app
  return {
    servicio: s >= 1,
    hora: s >= 2 ? '15:00' : '',
    confirmando: s === 3,
    listo: s >= 4 && s <= 6,
    nueva: s >= 4
  }
})

// ── Punto de venta: caja de almacén ──
const productos = [
  { n: 'Pan amasado', p: 900 }, { n: 'Leche 1 L', p: 1190 }, { n: 'Café 250 g', p: 4990 },
  { n: 'Huevos x12', p: 3600 }, { n: 'Arroz 1 kg', p: 1490 }, { n: 'Bebida 1,5 L', p: 1790 }
]
const toques = ['Pan amasado', 'Pan amasado', 'Leche 1 L', 'Café 250 g', 'Huevos x12']
const pos = computed(() => {
  const s = active.value === 'pos' ? step.value : QUIETO.pos
  const n = Math.min(s, toques.length)
  const lineas: { n: string; q: number; p: number }[] = []
  for (const nombre of toques.slice(0, n)) {
    const l = lineas.find(x => x.n === nombre)
    if (l) l.q++
    else lineas.push({ n: nombre, q: 1, p: productos.find(p => p.n === nombre)!.p })
  }
  return {
    lineas,
    toque: s >= 1 && s <= toques.length ? toques[s - 1] : '',
    total: lineas.reduce((t, l) => t + l.q * l.p, 0),
    cobrando: s === 6,
    listo: s >= 7 && s <= 8
  }
})

const tabActual = computed(() => tabs.find(t => t.k === active.value)!)

function elegir(k: Kind) {
  autoRotar.value = false
  active.value = k
  step.value = movimiento ? 0 : QUIETO[k]
}

// ── Motor de la animación ──
let movimiento = false
let timer: ReturnType<typeof setInterval> | undefined
let visible = true
let obs: IntersectionObserver | undefined
const raiz = ref<HTMLElement | null>(null)

function avanzar() {
  if (!visible || document.hidden) return
  const sig = step.value + 1
  if (sig < LARGO[active.value]) { step.value = sig; return }
  step.value = 0
  if (autoRotar.value) {
    const i = tabs.findIndex(t => t.k === active.value)
    active.value = tabs[(i + 1) % tabs.length]!.k
  }
}

onMounted(() => {
  movimiento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!movimiento) return
  step.value = 0
  timer = setInterval(avanzar, TICK)
  if (raiz.value && 'IntersectionObserver' in window) {
    obs = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting })
    obs.observe(raiz.value)
  }
})
onBeforeUnmount(() => { clearInterval(timer); obs?.disconnect() })
</script>

<template>
  <header class="hero" id="inicio">
    <div class="wrap">
      <div>
        <p class="label">Desarrollo a medida · Chile</p>
        <h1 style="margin-top:16px">Tu idea, construida como <em>web, app</em> o punto de venta.</h1>
        <p class="lede">Creo la página web, la app o el sistema de caja que tu negocio necesita para vender más y trabajar con menos enredos. A tu medida y con precio cerrado desde el primer día.</p>
        <div class="cta">
          <a class="btn btn-primary" href="#contacto">Cuéntame tu proyecto →</a>
          <NuxtLink class="btn btn-primary" to="/demo-punto-de-venta">▶ Probar una demo</NuxtLink>
        </div>
        <p class="demo-hint">Prueba gratis una caja de almacén o una app de reservas, desde tu celular.</p>
        <div class="meta">
          <span>Respuesta en 24 h hábiles</span>
          <span>Presupuesto en CLP + IVA</span>
          <span>Código y dominio a tu nombre</span>
        </div>
      </div>

      <div ref="raiz" class="studio">
        <div class="tabs" role="tablist" aria-label="Tipo de proyecto">
          <button
            v-for="t in tabs"
            :key="t.k"
            :id="`tab-${t.k}`"
            role="tab"
            :aria-selected="active === t.k ? 'true' : 'false'"
            :aria-controls="`f-${t.k}`"
            @click="elegir(t.k)"
          >{{ t.label }}</button>
        </div>

        <div class="stage">
          <!-- Web: tienda de pastelería -->
          <div class="frame" :class="{ on: active === 'web' }" id="f-web" role="tabpanel" aria-labelledby="tab-web">
            <div class="hs-browser">
              <div class="hs-bar"><b></b><b></b><b></b><span class="hs-url">https://www.tunegocio.cl</span></div>
              <div class="hs-shop">
                <div class="hs-shop-top">
                  <b>Dulce Hogar</b>
                  <span class="hs-cart" :class="{ bump: web.toque >= 0 }">🛒<i v-if="web.agregados.length">{{ web.agregados.length }}</i></span>
                </div>
                <p class="hs-shop-h">Tortas y dulces por encargo · retiro o despacho</p>
                <div class="hs-prods">
                  <div v-for="(t, i) in tortas" :key="t.n" class="hs-prod" :class="{ tap: web.toque === i }">
                    <div class="hs-ph" :style="{ '--c': t.c }"><span>{{ t.e }}</span></div>
                    <b>{{ t.n }}</b>
                    <span>{{ clp(t.p) }}</span>
                    <em :class="{ ok: web.agregados.includes(i) }">{{ web.agregados.includes(i) ? '✓ Agregado' : 'Agregar' }}</em>
                  </div>
                </div>
                <div class="hs-drawer" :class="{ open: web.carro }">
                  <div class="hs-row"><b>Tu pedido</b><span>{{ web.agregados.length }} productos</span></div>
                  <div class="hs-row hs-muted"><span>Retiro: sábado 10:00</span><span>{{ clp(web.total) }}</span></div>
                  <div class="hs-pay" :class="{ press: web.pagando }">Pagar con Webpay · {{ clp(web.total) }}</div>
                </div>
                <div class="hs-done" :class="{ show: web.listo }"><i>✓</i><b>¡Pedido recibido!</b><span>Te avisamos cuando esté listo</span></div>
              </div>
            </div>
          </div>

          <!-- App: reservas -->
          <div class="frame" :class="{ on: active === 'app' }" id="f-app" role="tabpanel" aria-labelledby="tab-app">
            <div class="hs-phones">
              <div class="hs-phone">
                <div class="hs-t">Barbería Norte</div>
                <div class="hs-sub">1. Elige el servicio</div>
                <div class="hs-chips">
                  <span :class="{ on: app.servicio }">Corte · $10.000</span>
                  <span>Barba · $6.000</span>
                </div>
                <div class="hs-sub">2. Elige la hora · hoy</div>
                <div class="hs-slots">
                  <span v-for="h in horas" :key="h.h" :class="{ off: !h.libre, on: app.hora === h.h }">{{ h.h }}</span>
                </div>
                <div class="hs-pay" :class="{ press: app.confirmando, dim: !app.hora }">Confirmar reserva</div>
                <div class="hs-done" :class="{ show: app.listo }"><i>✓</i><b>¡Reservado!</b><span>Hoy 15:00 · te recordamos 1 h antes</span></div>
              </div>
              <div class="hs-phone hs-agenda">
                <div class="hs-t">Agenda de hoy</div>
                <div class="hs-bal">{{ app.nueva ? 4 : 3 }} citas</div>
                <ul>
                  <li><span>09:30</span><span>Corte</span></li>
                  <li><span>11:00</span><span>Barba</span></li>
                  <li v-if="app.nueva" class="nueva"><span>15:00</span><span>Corte · nueva</span></li>
                  <li><span>17:15</span><span>Corte</span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Punto de venta -->
          <div class="frame" :class="{ on: active === 'pos' }" id="f-pos" role="tabpanel" aria-labelledby="tab-pos">
            <div class="hs-browser">
              <div class="hs-bar"><b></b><b></b><b></b><span class="hs-url">Caja 1 · Almacén Don Pedro</span></div>
              <div class="hs-pos">
                <div class="hs-grid">
                  <div v-for="p in productos" :key="p.n" class="hs-item" :class="{ tap: pos.toque === p.n }"><b>{{ p.n }}</b><span>{{ clp(p.p) }}</span></div>
                </div>
                <div class="hs-ticket">
                  <div class="hs-t">Venta actual</div>
                  <ul>
                    <li v-for="l in pos.lineas" :key="l.n"><span>{{ l.q }} × {{ l.n }}</span><span>{{ clp(l.q * l.p) }}</span></li>
                    <li v-if="!pos.lineas.length" class="hs-muted"><span>Toca un producto…</span></li>
                  </ul>
                  <div class="hs-total"><span>Total</span><span>{{ clp(pos.total) }}</span></div>
                  <div class="hs-pay" :class="{ press: pos.cobrando, dim: !pos.total }">Cobrar · Boleta</div>
                </div>
                <div class="hs-done" :class="{ show: pos.listo }"><i>✓</i><b>Venta registrada</b><span>Stock actualizado · {{ clp(pos.total) }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink class="hs-go" :to="tabActual.to">{{ tabActual.cta }}</NuxtLink>
      </div>
    </div>
  </header>
</template>
