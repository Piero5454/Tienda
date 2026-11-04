<script setup lang="ts">
import { soluciones, negocios, EXTRA, type Solucion } from '~~/shared/cotizador'

const { abierto, resumen } = useCotizador()
const { $evento } = useNuxtApp()

type Paso = 'negocio' | 'solucion' | 'detalle' | 'resultado'
const paso = ref<Paso>('negocio')
const sel = reactive({
  negocio: '' as string,
  solucion: '' as Solucion | '',
  cajas: 1,
  muchosProductos: false,
  muchosProfesionales: false
})

const negocio = computed(() => negocios.find(n => n.id === sel.negocio))
const sol = computed(() => (sel.solucion ? soluciones[sel.solucion] : null))
const tieneDetalle = computed(() => sel.solucion === 'pos' || sel.solucion === 'tienda' || sel.solucion === 'reservas')
const pasos = computed<Paso[]>(() => ['negocio', 'solucion', ...(tieneDetalle.value ? ['detalle' as Paso] : []), 'resultado'])
const indice = computed(() => pasos.value.indexOf(paso.value))

const clp = (n: number) => '$' + n.toLocaleString('es-CL')

const extras = computed(() => {
  const out: { t: string; v: number }[] = []
  if (sel.solucion === 'pos' && sel.cajas > 1) out.push({ t: `${sel.cajas === 3 ? '3 o más cajas' : '2 cajas'} o sucursales`, v: EXTRA.cajaAdicional * (sel.cajas - 1) })
  if ((sel.solucion === 'pos' || sel.solucion === 'tienda') && sel.muchosProductos) out.push({ t: 'Más de 500 productos', v: EXTRA.muchosProductos })
  if (sel.solucion === 'reservas' && sel.muchosProfesionales) out.push({ t: 'Más de 3 profesionales', v: EXTRA.muchosProfesionales })
  return out
})
const rango = computed(() => {
  const r = sol.value?.rango
  if (!r) return null
  const suma = extras.value.reduce((s, e) => s + e.v, 0)
  return [r[0] + suma, r[1] + suma] as const
})

const detalleTexto = computed(() => {
  const d: string[] = []
  if (sel.solucion === 'pos') d.push(sel.cajas === 1 ? '1 caja' : sel.cajas === 2 ? '2 cajas o sucursales' : '3 o más cajas o sucursales')
  if (sel.solucion === 'pos' || sel.solucion === 'tienda') d.push(sel.muchosProductos ? 'más de 500 productos' : 'hasta 500 productos')
  if (sel.solucion === 'reservas') d.push(sel.muchosProfesionales ? 'más de 3 profesionales' : '1 a 3 profesionales')
  return d.join(', ')
})

const textoResumen = computed(() => {
  if (!sol.value || !negocio.value) return ''
  const precio = rango.value ? `Estimado: ${clp(rango.value[0])} – ${clp(rango.value[1])} + IVA.` : 'Precio: a cotizar en reunión.'
  return `Negocio: ${negocio.value.nombre}. Necesito: ${sol.value.nombre}${detalleTexto.value ? ` (${detalleTexto.value})` : ''}. ${precio}`
})

const whatsapp = computed(() => whatsappUrl(`Hola, usé el cotizador de tu página.\n${textoResumen.value}\n¿Podemos conversar?`))

function elegirNegocio(id: string) {
  sel.negocio = id
  if (!sel.solucion) sel.solucion = negocios.find(n => n.id === id)!.sugiere
  paso.value = 'solucion'
}
function elegirSolucion(s: Solucion) {
  sel.solucion = s
  siguiente()
}
function siguiente() {
  const i = indice.value
  if (i < pasos.value.length - 1) paso.value = pasos.value[i + 1]
  if (paso.value === 'resultado') {
    resumen.value = { tipo: sol.value!.tipoFormulario, texto: textoResumen.value }
    $evento?.('cotizador-resultado')
  }
}
function atras() {
  const i = indice.value
  if (i > 0) paso.value = pasos.value[i - 1]
}
function cerrar() { abierto.value = false }
function reiniciar() {
  Object.assign(sel, { negocio: '', solucion: '', cajas: 1, muchosProductos: false, muchosProfesionales: false })
  paso.value = 'negocio'
}
function irFormulario() {
  cerrar()
  nextTick(() => {
    const el = document.getElementById('contacto')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else navigateTo('/#contacto')
  })
}

// Esc para cerrar, bloquear el scroll de fondo y llevar el foco a la ventana
const caja = ref<HTMLElement | null>(null)
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
watch(abierto, (v) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) {
    window.addEventListener('keydown', onKey)
    nextTick(() => caja.value?.focus())
  } else {
    window.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(() => { if (import.meta.client) { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = '' } })
</script>

<template>
  <Teleport to="body">
    <Transition name="cot">
      <div v-if="abierto" class="cot-overlay" @click.self="cerrar">
        <div ref="caja" class="cot" role="dialog" aria-modal="true" aria-labelledby="cot-title" tabindex="-1">
          <header class="cot-head">
            <div>
              <p class="label">Cotizador · 1 minuto</p>
              <h2 id="cot-title">¿Cuánto cuesta tu proyecto?</h2>
            </div>
            <button type="button" class="cot-x" aria-label="Cerrar cotizador" @click="cerrar">×</button>
          </header>
          <div class="cot-progress" aria-hidden="true">
            <i v-for="(p, i) in pasos" :key="p" :class="{ on: i <= indice }"></i>
          </div>

          <div class="cot-body">
            <!-- 1. Negocio -->
            <template v-if="paso === 'negocio'">
              <h3>¿Qué tipo de negocio tienes?</h3>
              <div class="cot-opts">
                <button v-for="n in negocios" :key="n.id" type="button" class="cot-opt" :class="{ on: sel.negocio === n.id }" @click="elegirNegocio(n.id)">
                  <span class="cot-ico" aria-hidden="true">{{ n.icono }}</span>{{ n.nombre }}
                </button>
              </div>
            </template>

            <!-- 2. Solución -->
            <template v-else-if="paso === 'solucion'">
              <h3>¿Qué necesitas?</h3>
              <div class="cot-opts">
                <button v-for="(s, k) in soluciones" :key="k" type="button" class="cot-opt" :class="{ on: sel.solucion === k }" @click="elegirSolucion(k)">
                  <span class="cot-opt-main">{{ s.nombre }}<small v-if="negocio?.sugiere === k" class="cot-tag">Recomendado para tu negocio</small></span>
                  <small class="cot-from">{{ s.rango ? `desde ${clp(s.rango[0])}` : 'a cotizar' }}</small>
                </button>
              </div>
            </template>

            <!-- 3. Detalle -->
            <template v-else-if="paso === 'detalle'">
              <template v-if="sel.solucion === 'pos'">
                <h3>¿Cuántas cajas o sucursales?</h3>
                <div class="cot-seg">
                  <button v-for="n in [1, 2, 3]" :key="n" type="button" :class="{ on: sel.cajas === n }" @click="sel.cajas = n">{{ n === 3 ? '3 o más' : n }}</button>
                </div>
              </template>
              <template v-if="sel.solucion === 'pos' || sel.solucion === 'tienda'">
                <h3>¿Cuántos productos vas a cargar?</h3>
                <div class="cot-seg">
                  <button type="button" :class="{ on: !sel.muchosProductos }" @click="sel.muchosProductos = false">Hasta 500</button>
                  <button type="button" :class="{ on: sel.muchosProductos }" @click="sel.muchosProductos = true">Más de 500</button>
                </div>
              </template>
              <template v-if="sel.solucion === 'reservas'">
                <h3>¿Cuántos profesionales atienden?</h3>
                <div class="cot-seg">
                  <button type="button" :class="{ on: !sel.muchosProfesionales }" @click="sel.muchosProfesionales = false">1 a 3</button>
                  <button type="button" :class="{ on: sel.muchosProfesionales }" @click="sel.muchosProfesionales = true">Más de 3</button>
                </div>
              </template>
              <button type="button" class="btn btn-primary cot-next" @click="siguiente">Ver mi precio estimado →</button>
            </template>

            <!-- 4. Resultado -->
            <template v-else>
              <p class="cot-for">{{ negocio?.icono }} {{ sol?.nombre }} para {{ negocio?.nombre.toLowerCase() }}<template v-if="detalleTexto"> · {{ detalleTexto }}</template></p>
              <div v-if="rango" class="cot-price">
                <small>Tu proyecto ronda entre</small>
                <b>{{ clp(rango[0]) }} – {{ clp(rango[1]) }}</b>
                <small>+ IVA · estimado</small>
              </div>
              <div v-else class="cot-price">
                <b class="cot-price-text">Se cotiza en una conversación</b>
                <small>Una app propia depende mucho del alcance. La cotizo después de una llamada de 20 minutos, sin costo.</small>
              </div>
              <ul class="cot-inc">
                <li v-for="i in sol?.incluye" :key="i">{{ i }}</li>
                <li v-for="e in extras" :key="e.t" class="cot-extra">{{ e.t }} (+{{ clp(e.v) }})</li>
              </ul>
              <a class="btn cot-wa" :href="whatsapp" target="_blank" rel="noopener" @click="$evento?.('cotizador-whatsapp')">Enviar esta cotización por WhatsApp</a>
              <button type="button" class="btn btn-ghost cot-alt" @click="irFormulario">Prefiero el formulario</button>
              <p class="cot-note">El precio final te lo envío cerrado y por escrito después de conversar. Puede bajar si necesitas menos cosas.</p>
              <button type="button" class="cot-link" @click="reiniciar">Empezar de nuevo</button>
            </template>
          </div>

          <footer v-if="paso !== 'negocio' && paso !== 'resultado'" class="cot-foot">
            <button type="button" class="cot-link" @click="atras">‹ Volver</button>
          </footer>
          <footer v-else-if="paso === 'resultado'" class="cot-foot">
            <button type="button" class="cot-link" @click="atras">‹ Cambiar respuestas</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cot-overlay{position:fixed; inset:0; z-index:30; background:rgb(20 19 15 / .5); display:grid; place-items:center; padding:16px; backdrop-filter:blur(3px)}
.cot{width:min(520px,100%); max-height:calc(100dvh - 32px); overflow:auto; background:var(--surface); color:var(--ink); border:1px solid var(--line); border-radius:16px; box-shadow:0 30px 70px rgb(0 0 0 / .3); display:flex; flex-direction:column; outline:none}
.cot-head{display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:22px 22px 10px}
.cot-head h2{font-size:1.5rem; margin-top:6px}
.cot-x{width:36px; height:36px; flex:none; border-radius:50%; border:1px solid var(--line); background:var(--paper); color:var(--ink); font:400 22px/1 var(--f-body); cursor:pointer}
.cot-progress{display:flex; gap:4px; padding:0 22px}
.cot-progress i{flex:1; height:4px; border-radius:2px; background:var(--line); transition:background .2s}
.cot-progress i.on{background:var(--accent)}
.cot-body{padding:18px 22px 8px; display:grid; gap:12px}
.cot-body h3{font-size:1.1rem}
.cot-body h3 + .cot-seg{margin-bottom:6px}
.cot-opts{display:grid; gap:8px}
.cot-opt{display:flex; align-items:center; justify-content:space-between; gap:12px; text-align:left; padding:14px 16px; border-radius:12px; border:1px solid var(--line); background:var(--paper); color:var(--ink); font:500 var(--s-md)/1.3 var(--f-body); cursor:pointer; transition:border-color .15s, transform .1s}
.cot-opt:hover{border-color:var(--accent)}
.cot-opt:active{transform:scale(.99)}
.cot-opt.on{border-color:var(--accent); background:color-mix(in srgb,var(--accent) 8%,var(--paper))}
.cot-opts .cot-opt:has(.cot-ico){justify-content:flex-start}
.cot-ico{font-size:1.4rem; width:32px; text-align:center}
.cot-opt-main{display:grid; gap:4px}
.cot-tag{font:600 11px/1 var(--f-mono); color:var(--signal); text-transform:uppercase; letter-spacing:.04em}
.cot-from{font:500 var(--s-xs)/1 var(--f-mono); color:var(--muted); white-space:nowrap}
.cot-seg{display:flex; gap:8px; flex-wrap:wrap}
.cot-seg button{flex:1; min-width:90px; padding:13px 10px; border-radius:10px; border:1px solid var(--line); background:var(--paper); color:var(--ink); font:600 var(--s-sm)/1 var(--f-body); cursor:pointer}
.cot-seg button.on{border-color:var(--accent); background:var(--accent); color:var(--accent-ink)}
.cot-next{justify-content:center; margin-top:8px}

.cot-for{font-size:var(--s-sm); color:var(--muted)}
.cot-price{display:grid; gap:4px; padding:18px; border-radius:12px; background:color-mix(in srgb,var(--accent) 9%,var(--paper)); border:1px solid color-mix(in srgb,var(--accent) 30%,var(--line))}
.cot-price small{color:var(--muted); font-size:var(--s-sm)}
.cot-price b{font:800 clamp(1.5rem,6vw,2rem)/1.1 var(--f-display); color:var(--accent); font-variant-numeric:tabular-nums}
.cot-price b.cot-price-text{font-size:1.35rem}
.cot-inc{list-style:none; margin:0; padding:0; display:grid; gap:6px; font-size:var(--s-sm)}
.cot-inc li{display:flex; gap:8px}
.cot-inc li::before{content:"✓"; color:var(--accent); font-weight:700}
.cot-inc li.cot-extra::before{content:"+"; color:var(--signal)}
.cot-wa{justify-content:center; background:#1FA855; color:#fff; padding:15px 18px; font-size:var(--s-md)}
.cot-wa:hover{transform:translateY(-1px)}
.cot-alt{justify-content:center}
.cot-note{font-size:var(--s-xs); color:var(--muted); text-align:center}
.cot-link{background:none; border:0; padding:6px 0; color:var(--accent); font:600 var(--s-sm)/1 var(--f-body); cursor:pointer; justify-self:center}
.cot-foot{padding:4px 22px 18px}

.cot-enter-active,.cot-leave-active{transition:opacity .2s}
.cot-enter-active .cot,.cot-leave-active .cot{transition:transform .25s ease}
.cot-enter-from,.cot-leave-to{opacity:0}
.cot-enter-from .cot,.cot-leave-to .cot{transform:translateY(16px) scale(.98)}
@media (max-width:560px){
  .cot-overlay{place-items:end center; padding:0}
  .cot{border-radius:18px 18px 0 0; max-height:92dvh}
  .cot-enter-from .cot,.cot-leave-to .cot{transform:translateY(100%)}
}
</style>
