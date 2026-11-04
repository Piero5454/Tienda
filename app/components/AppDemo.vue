<script setup lang="ts">
// Demo de app de reservas para una barbería. Todo ocurre en el navegador:
// no guarda datos reales y se reinicia al recargar la página.

interface Servicio { id: string; nombre: string; precio: number; min: number }
interface Profesional { id: string; nombre: string }
interface Cita { dia: string; hora: string; servicio: Servicio; prof: Profesional; cliente: string; mia?: boolean }

const servicios: Servicio[] = [
  { id: 'corte', nombre: 'Corte de pelo', precio: 10000, min: 30 },
  { id: 'corte-barba', nombre: 'Corte + barba', precio: 14000, min: 60 },
  { id: 'barba', nombre: 'Perfilado de barba', precio: 6000, min: 30 },
  { id: 'color', nombre: 'Color o visos', precio: 25000, min: 90 }
]
const profesionales: Profesional[] = [
  { id: 'matias', nombre: 'Matías' },
  { id: 'javiera', nombre: 'Javiera' },
  { id: 'diego', nombre: 'Diego' }
]
const clientes = ['Camila R.', 'Tomás P.', 'Valentina S.', 'Benjamín M.', 'Josefa L.', 'Martín A.', 'Antonia C.', 'Vicente G.', 'Fernanda O.', 'Joaquín D.']
const HORAS = Array.from({ length: 19 }, (_, i) => `${String(10 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`) // 10:00 a 19:00

const emit = defineEmits<{ reservado: [] }>()
const vista = defineModel<'cliente' | 'negocio'>('vista', { default: 'cliente' })

const clp = (n: number) => '$' + n.toLocaleString('es-CL')
const clave = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

// Próximos 7 días hábiles (cerrado domingo)
const hoy = new Date()
const dias = (() => {
  const out: { d: Date; key: string; corto: string; num: number; hoy: boolean }[] = []
  for (let i = 0; out.length < 7; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i)
    if (d.getDay() === 0) continue
    out.push({ d, key: clave(d), corto: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : d.toLocaleDateString('es-CL', { weekday: 'short' }).replace('.', ''), num: d.getDate(), hoy: i === 0 })
  }
  return out
})()

// Agenda ya ocupada (inventada pero estable): bloques de 30 min por profesional
function citasBase(): Cita[] {
  const out: Cita[] = []
  for (const dia of dias) {
    for (const p of profesionales) {
      let i = 0
      while (i < HORAS.length) {
        const h = hash(dia.key + p.id + i)
        if (h % 5 < 2) {
          const s = servicios[h % servicios.length]
          const bloques = s.min / 30
          if (i + bloques <= HORAS.length) {
            out.push({ dia: dia.key, hora: HORAS[i], servicio: s, prof: p, cliente: clientes[h % clientes.length] })
            i += bloques
            continue
          }
        }
        i++
      }
    }
  }
  return out
}

const citas = ref<Cita[]>(citasBase())
const paso = ref<'servicio' | 'prof' | 'hora' | 'datos' | 'listo'>('servicio')
const sel = reactive<{ servicio: Servicio | null; prof: Profesional | null; dia: string; hora: string; nombre: string; telefono: string }>({
  servicio: null, prof: null, dia: dias[0].key, hora: '', nombre: '', telefono: ''
})
const asignado = ref<Profesional | null>(null)
const aviso = ref(false)
const diaNegocio = ref(dias[0].key)
let timer: ReturnType<typeof setTimeout> | undefined

const ocupado = (dia: string, p: Profesional, idx: number) => citas.value.some(c => {
  if (c.dia !== dia || c.prof.id !== p.id) return false
  const ini = HORAS.indexOf(c.hora)
  return idx >= ini && idx < ini + c.servicio.min / 30
})

function libre(dia: string, p: Profesional, idx: number, s: Servicio) {
  const bloques = s.min / 30
  if (idx + bloques > HORAS.length) return false
  const d = dias.find(x => x.key === dia)!
  if (d.hoy) {
    const [hh, mm] = HORAS[idx].split(':').map(Number)
    if (hh * 60 + mm <= hoy.getHours() * 60 + hoy.getMinutes() + 30) return false
  }
  for (let k = 0; k < bloques; k++) if (ocupado(dia, p, idx + k)) return false
  return true
}

const horasDisponibles = computed(() => {
  const s = sel.servicio
  if (!s) return []
  const profs = sel.prof ? [sel.prof] : profesionales
  return HORAS.map((h, i) => ({ h, prof: profs.find(p => libre(sel.dia, p, i, s)) ?? null })).filter(x => x.prof)
})

const diaSel = computed(() => dias.find(d => d.key === sel.dia)!)
const fechaLarga = (key: string) => dias.find(d => d.key === key)!.d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })

function elegirServicio(s: Servicio) { sel.servicio = s; paso.value = 'prof' }
function elegirProf(p: Profesional | null) { sel.prof = p; paso.value = 'hora' }
function elegirHora(h: string, p: Profesional) { sel.hora = h; asignado.value = p; paso.value = 'datos' }
function atras() {
  paso.value = ({ prof: 'servicio', hora: 'prof', datos: 'hora', servicio: 'servicio', listo: 'servicio' } as const)[paso.value]
}

function confirmar() {
  if (!sel.servicio || !asignado.value) return
  citas.value.push({ dia: sel.dia, hora: sel.hora, servicio: sel.servicio, prof: asignado.value, cliente: sel.nombre.trim() || 'Tú', mia: true })
  diaNegocio.value = sel.dia
  paso.value = 'listo'
  emit('reservado')
  clearTimeout(timer)
  timer = setTimeout(() => { aviso.value = true }, 1800)
}

function otra() {
  Object.assign(sel, { servicio: null, prof: null, hora: '', dia: dias[0].key })
  aviso.value = false
  paso.value = 'servicio'
}

function reiniciar() {
  citas.value = citasBase()
  Object.assign(sel, { servicio: null, prof: null, hora: '', dia: dias[0].key, nombre: '', telefono: '' })
  aviso.value = false
  diaNegocio.value = dias[0].key
  paso.value = 'servicio'
  vista.value = 'cliente'
}
defineExpose({ reiniciar })

const agendaDia = computed(() => citas.value
  .filter(c => c.dia === diaNegocio.value)
  .sort((a, b) => HORAS.indexOf(a.hora) - HORAS.indexOf(b.hora) || a.prof.nombre.localeCompare(b.prof.nombre)))
const ingresosDia = computed(() => agendaDia.value.reduce((s, c) => s + c.servicio.precio, 0))
const finHora = (c: Cita) => HORAS[HORAS.indexOf(c.hora) + c.servicio.min / 30] ?? '19:30'

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="rsv-phone" :class="{ 'rsv-dark': vista === 'negocio' }">
    <div class="rsv-notch" aria-hidden="true"></div>
    <div class="rsv-screen">
      <!-- Notificación de recordatorio -->
      <Transition name="drop">
        <button v-if="aviso && vista === 'cliente'" type="button" class="app-notif" @click="aviso = false">
          <span class="app-notif-icon" aria-hidden="true">✂</span>
          <span><b>Barbería Ejemplo · Recordatorio</b>Te esperamos {{ diaSel.hoy ? 'hoy' : fechaLarga(sel.dia) }} a las {{ sel.hora }} con {{ asignado?.nombre }}. ¿Necesitas cambiar tu hora?</span>
        </button>
      </Transition>

      <!-- VISTA CLIENTE -->
      <template v-if="vista === 'cliente'">
        <header class="app-bar">
          <button v-if="paso !== 'servicio' && paso !== 'listo'" type="button" class="app-back" aria-label="Volver" @click="atras">‹</button>
          <div>
            <b>Barbería Ejemplo</b>
            <small>Reserva tu hora</small>
          </div>
        </header>

        <div v-if="paso !== 'listo'" class="app-steps" aria-hidden="true">
          <i v-for="(p, i) in ['servicio', 'prof', 'hora', 'datos']" :key="p" :class="{ on: ['servicio', 'prof', 'hora', 'datos'].indexOf(paso) >= i }"></i>
        </div>

        <div class="app-body">
          <template v-if="paso === 'servicio'">
            <h3>¿Qué te quieres hacer?</h3>
            <button v-for="s in servicios" :key="s.id" type="button" class="app-row" @click="elegirServicio(s)">
              <span><b>{{ s.nombre }}</b><small>{{ s.min }} min</small></span>
              <span class="app-price">{{ clp(s.precio) }}</span>
            </button>
          </template>

          <template v-else-if="paso === 'prof'">
            <h3>¿Con quién?</h3>
            <button type="button" class="app-row" @click="elegirProf(null)">
              <span class="app-avatar any" aria-hidden="true">★</span>
              <span class="rsv-grow"><b>Cualquiera</b><small>La primera hora disponible</small></span>
            </button>
            <button v-for="p in profesionales" :key="p.id" type="button" class="app-row" @click="elegirProf(p)">
              <span class="app-avatar" aria-hidden="true">{{ p.nombre[0] }}</span>
              <span class="rsv-grow"><b>{{ p.nombre }}</b><small>Barbero/a</small></span>
            </button>
          </template>

          <template v-else-if="paso === 'hora'">
            <h3>Elige día y hora</h3>
            <div class="app-days">
              <button v-for="d in dias" :key="d.key" type="button" :class="{ on: sel.dia === d.key }" @click="sel.dia = d.key">
                <small>{{ d.corto }}</small><b>{{ d.num }}</b>
              </button>
            </div>
            <div v-if="horasDisponibles.length" class="app-hours">
              <button v-for="x in horasDisponibles" :key="x.h" type="button" @click="elegirHora(x.h, x.prof!)">{{ x.h }}</button>
            </div>
            <p v-else class="app-muted">No quedan horas este día. Prueba con otro.</p>
          </template>

          <template v-else-if="paso === 'datos'">
            <h3>Confirma tu reserva</h3>
            <div class="app-summary">
              <div><span>Servicio</span><b>{{ sel.servicio?.nombre }}</b></div>
              <div><span>Con</span><b>{{ asignado?.nombre }}</b></div>
              <div><span>Cuándo</span><b>{{ diaSel.hoy ? 'Hoy' : fechaLarga(sel.dia) }}, {{ sel.hora }}</b></div>
              <div><span>Valor</span><b>{{ clp(sel.servicio?.precio ?? 0) }}</b></div>
            </div>
            <label class="app-field">Tu nombre<input v-model="sel.nombre" autocomplete="off" placeholder="Ej: Camila"></label>
            <label class="app-field">Teléfono<input v-model="sel.telefono" type="tel" autocomplete="off" placeholder="+56 9 1234 5678"></label>
            <button type="button" class="app-cta" @click="confirmar">Reservar hora</button>
          </template>

          <template v-else>
            <div class="app-done">
              <span class="app-check" aria-hidden="true">✓</span>
              <h3>¡Hora reservada!</h3>
              <p>{{ sel.servicio?.nombre }} con {{ asignado?.nombre }}<br><b>{{ diaSel.hoy ? 'Hoy' : fechaLarga(sel.dia) }} · {{ sel.hora }}</b></p>
              <p class="app-muted">Te enviaremos un recordatorio antes de tu hora.</p>
              <button type="button" class="app-cta" @click="vista = 'negocio'">Ver cómo lo ve el negocio →</button>
              <button type="button" class="app-link" @click="otra">Reservar otra hora</button>
            </div>
          </template>
        </div>
      </template>

      <!-- VISTA NEGOCIO -->
      <template v-else>
        <header class="app-bar">
          <div>
            <b>Agenda</b>
            <small>Barbería Ejemplo · vista del dueño</small>
          </div>
        </header>
        <div class="app-body">
          <div class="app-days">
            <button v-for="d in dias" :key="d.key" type="button" :class="{ on: diaNegocio === d.key }" @click="diaNegocio = d.key">
              <small>{{ d.corto }}</small><b>{{ d.num }}</b>
            </button>
          </div>
          <div class="app-kpis">
            <div><small>Citas</small><b>{{ agendaDia.length }}</b></div>
            <div><small>Ingresos estimados</small><b>{{ clp(ingresosDia) }}</b></div>
          </div>
          <ul class="app-agenda">
            <li v-for="c in agendaDia" :key="c.dia + c.hora + c.prof.id" :class="{ mia: c.mia }">
              <span class="app-time">{{ c.hora }}<small>{{ finHora(c) }}</small></span>
              <span class="rsv-grow"><b>{{ c.cliente }}<em v-if="c.mia"> · nueva</em></b><small>{{ c.servicio.nombre }} · {{ c.prof.nombre }}</small></span>
            </li>
          </ul>
          <p v-if="!agendaDia.length" class="app-muted">Sin citas este día.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.rsv-phone{--app-bg:#FFFFFF; --app-ink:#1F2A24; --app-muted:#6B756E; --app-line:#ECE6DC; --app-soft:#F6F2EB; --app-accent:#1F6F50;
  position:relative; width:min(360px,100%); aspect-ratio:9/18.5; max-height:740px; margin-inline:auto; border-radius:44px; padding:12px; background:#1B1B1B; box-shadow:0 30px 60px rgb(0 0 0 / .25), inset 0 0 0 2px #333}
.rsv-phone.rsv-dark{--app-bg:#15140F; --app-ink:#EFEBE3; --app-muted:#A8A396; --app-line:#2E2C25; --app-soft:#211F19; --app-accent:#5CC49A}
.rsv-notch{position:absolute; top:20px; left:50%; translate:-50% 0; width:90px; height:24px; border-radius:999px; background:#000; z-index:3}
.rsv-screen{position:relative; height:100%; border-radius:34px; overflow:hidden; background:var(--app-bg); color:var(--app-ink); display:flex; flex-direction:column; font-size:14px; transition:background .3s}

.app-bar{display:flex; align-items:center; gap:8px; padding:52px 18px 12px; border-bottom:1px solid var(--app-line)}
.app-bar b{display:block; font:700 17px/1.2 var(--f-display)}
.app-bar small{color:var(--app-muted); font-size:12px}
.app-back{width:32px; height:32px; border-radius:50%; border:0; background:var(--app-soft); color:var(--app-ink); font:400 22px/1 var(--f-body); cursor:pointer; flex:none}
.app-steps{display:flex; gap:4px; padding:10px 18px 0}
.app-steps i{flex:1; height:3px; border-radius:2px; background:var(--app-line)}
.app-steps i.on{background:var(--app-accent)}
.app-body{flex:1; overflow:auto; padding:14px 16px 20px; display:flex; flex-direction:column; gap:8px}
.app-body h3{font:700 19px/1.2 var(--f-display); margin:4px 0 6px}
.app-muted{color:var(--app-muted); font-size:13px}

.app-row{display:flex; align-items:center; gap:12px; justify-content:space-between; width:100%; text-align:left; padding:13px 14px; border-radius:14px; border:1px solid var(--app-line); background:var(--app-bg); color:var(--app-ink); font:inherit; cursor:pointer}
.app-row:hover{border-color:var(--app-accent)}
.app-row b{display:block; font-weight:600}
.app-row small{color:var(--app-muted); font-size:12px}
.app-row .rsv-grow,.rsv-grow{flex:1; min-width:0}
.app-price{font:600 14px/1 var(--f-mono)}
.app-avatar{width:38px; height:38px; border-radius:50%; display:grid; place-items:center; background:color-mix(in srgb,var(--app-accent) 15%,var(--app-bg)); color:var(--app-accent); font:700 16px/1 var(--f-display); flex:none}
.app-avatar.any{background:color-mix(in srgb,#E07A4F 18%,var(--app-bg)); color:#E07A4F}

.app-days{display:flex; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; flex:none}
.app-days button{flex:none; width:48px; padding:8px 0; border-radius:12px; border:1px solid var(--app-line); background:var(--app-bg); color:var(--app-ink); display:grid; gap:2px; justify-items:center; cursor:pointer; font:inherit}
.app-days small{font-size:11px; color:var(--app-muted); text-transform:capitalize}
.app-days b{font:700 16px/1 var(--f-display)}
.app-days button.on{background:var(--app-accent); border-color:var(--app-accent); color:#fff}
.app-days button.on small{color:rgb(255 255 255 / .8)}
.app-hours{display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-top:6px}
.app-hours button{padding:10px 0; border-radius:10px; border:1px solid var(--app-line); background:var(--app-soft); color:var(--app-ink); font:500 13px/1 var(--f-mono); cursor:pointer}
.app-hours button:hover{border-color:var(--app-accent); color:var(--app-accent)}

.app-summary{display:grid; gap:0; border:1px solid var(--app-line); border-radius:14px; padding:4px 14px}
.app-summary div{display:flex; justify-content:space-between; gap:10px; padding:9px 0; border-bottom:1px solid var(--app-line)}
.app-summary div:last-child{border-bottom:0}
.app-summary span{color:var(--app-muted)}
.app-summary b{text-align:right; text-transform:none}
.app-field{display:grid; gap:4px; font-size:12px; font-weight:600; color:var(--app-muted); margin-top:4px}
.app-field input{font:inherit; font-size:16px; font-weight:400; padding:10px 12px; border-radius:10px; border:1px solid var(--app-line); background:var(--app-soft); color:var(--app-ink); width:100%}
.app-cta{margin-top:8px; padding:14px; border-radius:14px; border:0; background:var(--app-accent); color:#fff; font:600 15px/1 var(--f-body); cursor:pointer}
.app-link{background:none; border:0; color:var(--app-accent); font:600 14px/1 var(--f-body); padding:10px; cursor:pointer}

.app-done{display:grid; justify-items:center; text-align:center; gap:10px; padding-top:30px}
.app-check{width:64px; height:64px; border-radius:50%; background:var(--app-accent); color:#fff; display:grid; place-items:center; font-size:30px; animation:pop .4s ease-out}
.app-done p{line-height:1.5}
.app-done .app-cta{width:100%}
@keyframes pop{from{transform:scale(.4); opacity:0} to{transform:scale(1); opacity:1}}

.app-notif{position:absolute; top:52px; left:10px; right:10px; z-index:4; display:flex; gap:10px; align-items:flex-start; text-align:left; padding:12px; border-radius:18px; border:0; background:rgb(250 250 250 / .96); color:#1F2A24; box-shadow:0 10px 30px rgb(0 0 0 / .25); font:400 12.5px/1.4 var(--f-body); cursor:pointer; backdrop-filter:blur(10px)}
.app-notif b{display:block; font-size:12px; margin-bottom:2px}
.app-notif-icon{width:30px; height:30px; flex:none; border-radius:8px; background:#1F6F50; color:#fff; display:grid; place-items:center; font-size:15px}
.drop-enter-active,.drop-leave-active{transition:transform .35s ease, opacity .35s}
.drop-enter-from,.drop-leave-to{transform:translateY(-120%); opacity:0}

.app-kpis{display:grid; grid-template-columns:1fr 1.4fr; gap:8px; margin-top:4px}
.app-kpis div{background:var(--app-soft); border-radius:12px; padding:10px 12px; display:grid; gap:2px}
.app-kpis small{color:var(--app-muted); font-size:11px}
.app-kpis b{font:700 18px/1.1 var(--f-display)}
.app-agenda{list-style:none; margin:4px 0 0; padding:0; display:grid; gap:6px}
.app-agenda li{display:flex; gap:12px; align-items:center; padding:10px 12px; border-radius:12px; background:var(--app-soft); border-left:3px solid var(--app-line)}
.app-agenda li.mia{border-left-color:#E07A4F; background:color-mix(in srgb,#E07A4F 14%,var(--app-soft))}
.app-agenda b{display:block; font-weight:600; font-size:13.5px}
.app-agenda em{font-style:normal; color:#E07A4F}
.app-agenda small{color:var(--app-muted); font-size:12px}
.app-time{display:grid; font:600 13px/1.2 var(--f-mono); min-width:44px}
.app-time small{font-weight:400; font-size:11px}

@media (max-width:420px){ .rsv-phone{border-radius:36px; padding:9px} .rsv-screen{border-radius:28px} }
</style>
