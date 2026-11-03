<script setup lang="ts">
// Demo de punto de venta para un almacén. Todo ocurre en el navegador:
// no cobra, no emite boletas reales y se reinicia al recargar la página.

type Medio = 'Efectivo' | 'Tarjeta' | 'Transferencia'
interface Producto { id: number; codigo: string; nombre: string; cat: string; precio: number; stock: number; minimo: number }
interface Linea { id: number; cant: number }
interface Venta { n: number; hora: string; items: { nombre: string; cant: number; precio: number }[]; total: number; medio: Medio; recibido?: number }

const catalogo: Omit<Producto, 'id'>[] = [
  { codigo: '1001', nombre: 'Pan amasado (kg)', cat: 'Panadería', precio: 2400, stock: 18, minimo: 5 },
  { codigo: '1002', nombre: 'Hallulla (kg)', cat: 'Panadería', precio: 2200, stock: 15, minimo: 5 },
  { codigo: '7802900001', nombre: 'Leche entera 1 L', cat: 'Lácteos', precio: 1190, stock: 24, minimo: 8 },
  { codigo: '7802900002', nombre: 'Yogur frutilla', cat: 'Lácteos', precio: 450, stock: 6, minimo: 10 },
  { codigo: '7802900003', nombre: 'Mantequilla 250 g', cat: 'Lácteos', precio: 2690, stock: 9, minimo: 4 },
  { codigo: '7802900004', nombre: 'Huevos x12', cat: 'Lácteos', precio: 3600, stock: 3, minimo: 5 },
  { codigo: '7801610001', nombre: 'Bebida cola 1,5 L', cat: 'Bebidas', precio: 1790, stock: 30, minimo: 10 },
  { codigo: '7801610002', nombre: 'Agua mineral 1,6 L', cat: 'Bebidas', precio: 990, stock: 20, minimo: 8 },
  { codigo: '7801610003', nombre: 'Jugo néctar 1 L', cat: 'Bebidas', precio: 1290, stock: 12, minimo: 6 },
  { codigo: '7801320001', nombre: 'Arroz 1 kg', cat: 'Abarrotes', precio: 1490, stock: 16, minimo: 6 },
  { codigo: '7801320002', nombre: 'Fideos spaghetti 400 g', cat: 'Abarrotes', precio: 890, stock: 22, minimo: 8 },
  { codigo: '7801320003', nombre: 'Aceite maravilla 1 L', cat: 'Abarrotes', precio: 2990, stock: 7, minimo: 5 },
  { codigo: '7801320004', nombre: 'Azúcar 1 kg', cat: 'Abarrotes', precio: 1250, stock: 14, minimo: 6 },
  { codigo: '7801320005', nombre: 'Café instantáneo 170 g', cat: 'Abarrotes', precio: 4990, stock: 5, minimo: 3 },
  { codigo: '7801320006', nombre: 'Té 100 bolsitas', cat: 'Abarrotes', precio: 2390, stock: 8, minimo: 4 },
  { codigo: '7805000001', nombre: 'Papas fritas 180 g', cat: 'Snacks', precio: 1990, stock: 11, minimo: 5 },
  { codigo: '7805000002', nombre: 'Galletas de chocolate', cat: 'Snacks', precio: 790, stock: 0, minimo: 6 },
  { codigo: '7809000001', nombre: 'Detergente 1 L', cat: 'Limpieza', precio: 3490, stock: 6, minimo: 3 },
  { codigo: '7809000002', nombre: 'Papel higiénico x4', cat: 'Limpieza', precio: 2590, stock: 10, minimo: 4 }
]

const productos = ref<Producto[]>([])
const ventas = ref<Venta[]>([])
const ticket = ref<Linea[]>([])
const vista = ref<'vender' | 'stock' | 'cierre'>('vender')
const categoria = ref('Todos')
const busqueda = ref('')
const aviso = ref('')
const cobrando = ref<Medio | null>(null)
const recibido = ref<number | null>(null)
const boleta = ref<Venta | null>(null)
const cajaCerrada = ref<{ ventas: number; total: number } | null>(null)
let folio = 1040

const clp = (n: number) => '$' + Math.round(n).toLocaleString('es-CL')
const hora = (d = new Date()) => d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
const porId = (id: number) => productos.value.find(p => p.id === id)!

function reiniciar() {
  productos.value = catalogo.map((p, i) => ({ ...p, id: i + 1 }))
  ticket.value = []
  cobrando.value = null
  boleta.value = null
  cajaCerrada.value = null
  aviso.value = ''
  folio = 1040
  // Algunas ventas de la mañana, para que el cierre de caja tenga datos
  const previas: [number, number, Medio][] = [[1, 1, 'Efectivo'], [7, 2, 'Tarjeta'], [3, 2, 'Efectivo'], [10, 1, 'Transferencia'], [16, 1, 'Tarjeta'], [1, 1, 'Tarjeta']]
  const inicio = new Date()
  inicio.setHours(9, 12, 0, 0)
  ventas.value = previas.map(([id, cant, medio], i) => {
    const p = porId(id)
    p.stock -= cant
    const t = new Date(inicio.getTime() + i * 23 * 60000)
    return { n: ++folio, hora: hora(t), items: [{ nombre: p.nombre, cant, precio: p.precio }], total: p.precio * cant, medio }
  })
}
reiniciar()

const categorias = computed(() => ['Todos', ...new Set(catalogo.map(p => p.cat))])
const visibles = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  return productos.value.filter(p =>
    (categoria.value === 'Todos' || p.cat === categoria.value) &&
    (!q || p.nombre.toLowerCase().includes(q) || p.codigo.includes(q)))
})
const lineas = computed(() => ticket.value.map(l => ({ ...l, p: porId(l.id) })))
const total = computed(() => lineas.value.reduce((s, l) => s + l.p.precio * l.cant, 0))
const unidades = computed(() => ticket.value.reduce((s, l) => s + l.cant, 0))
const neto = computed(() => Math.round(total.value / 1.19))
const vuelto = computed(() => (recibido.value ?? 0) - total.value)
const alertas = computed(() => productos.value.filter(p => p.stock <= p.minimo).length)

function enTicket(id: number) { return ticket.value.find(l => l.id === id)?.cant ?? 0 }

function agregar(p: Producto) {
  if (cobrando.value) return
  if (enTicket(p.id) >= p.stock) {
    aviso.value = p.stock === 0 ? `${p.nombre}: sin stock.` : `${p.nombre}: solo quedan ${p.stock}.`
    return
  }
  const l = ticket.value.find(x => x.id === p.id)
  if (l) l.cant++
  else ticket.value.push({ id: p.id, cant: 1 })
  aviso.value = ''
}

function cambiar(id: number, d: number) {
  const l = ticket.value.find(x => x.id === id)
  if (!l) return
  if (d > 0) return agregar(porId(id))
  l.cant += d
  if (l.cant <= 0) ticket.value = ticket.value.filter(x => x.id !== id)
}

// Enter en el buscador: si coincide un código exacto (como un lector de barras), lo agrega
function buscarEnter() {
  const q = busqueda.value.trim()
  const p = productos.value.find(x => x.codigo === q) ?? (visibles.value.length === 1 ? visibles.value[0] : undefined)
  if (p) {
    agregar(p)
    busqueda.value = ''
  } else if (q) {
    aviso.value = `No encontré "${q}".`
  }
}

function simularLector() {
  const disponibles = productos.value.filter(p => p.stock > enTicket(p.id) && p.codigo.length > 4)
  const p = disponibles[Math.floor(Math.random() * disponibles.length)]
  if (p) {
    agregar(p)
    aviso.value = `Pip · ${p.codigo} → ${p.nombre}`
  }
}

function iniciarCobro(m: Medio) {
  if (!ticket.value.length) return
  cobrando.value = m
  recibido.value = m === 'Efectivo' ? null : total.value
}

const billetes = computed(() => {
  const t = total.value
  const opciones = [t, Math.ceil(t / 1000) * 1000, Math.ceil(t / 5000) * 5000, Math.ceil(t / 10000) * 10000, Math.ceil(t / 20000) * 20000]
  return [...new Set(opciones)].slice(0, 4)
})

function confirmar() {
  if (!cobrando.value || vuelto.value < 0) return
  const v: Venta = {
    n: ++folio,
    hora: hora(),
    items: lineas.value.map(l => ({ nombre: l.p.nombre, cant: l.cant, precio: l.p.precio })),
    total: total.value,
    medio: cobrando.value,
    ...(cobrando.value === 'Efectivo' ? { recibido: recibido.value ?? total.value } : {})
  }
  for (const l of lineas.value) l.p.stock -= l.cant
  ventas.value.push(v)
  boleta.value = v
  ticket.value = []
  cobrando.value = null
  recibido.value = null
  const bajos = v.items.map(i => productos.value.find(p => p.nombre === i.nombre)!).filter(p => p.stock <= p.minimo)
  aviso.value = bajos.length ? `Atención: ${bajos.map(p => p.nombre).join(', ')} ${bajos.length > 1 ? 'están' : 'está'} por agotarse.` : ''
}

function reponer(p: Producto, n = 10) { p.stock += n }

const resumen = computed(() => {
  const porMedio: Record<Medio, number> = { Efectivo: 0, Tarjeta: 0, Transferencia: 0 }
  const top = new Map<string, number>()
  for (const v of ventas.value) {
    porMedio[v.medio] += v.total
    for (const i of v.items) top.set(i.nombre, (top.get(i.nombre) ?? 0) + i.cant)
  }
  const tot = ventas.value.reduce((s, v) => s + v.total, 0)
  return {
    total: tot,
    n: ventas.value.length,
    promedio: ventas.value.length ? tot / ventas.value.length : 0,
    porMedio,
    top: [...top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }
})

function cerrarCaja() {
  cajaCerrada.value = { ventas: resumen.value.n, total: resumen.value.total }
  ventas.value = []
}

const ticketEl = ref<HTMLElement | null>(null)
const verTicket = () => ticketEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
</script>

<template>
  <div class="caja">
    <div class="caja-top">
      <div class="caja-tabs" role="tablist" aria-label="Secciones de la caja">
        <button role="tab" :aria-selected="vista === 'vender'" @click="vista = 'vender'">Vender</button>
        <button role="tab" :aria-selected="vista === 'stock'" @click="vista = 'stock'">
          Stock <span v-if="alertas" class="caja-badge">{{ alertas }}</span>
        </button>
        <button role="tab" :aria-selected="vista === 'cierre'" @click="vista = 'cierre'">Cierre de caja</button>
      </div>
      <button class="caja-link" type="button" @click="reiniciar">Reiniciar demo</button>
    </div>

    <!-- VENDER -->
    <div v-if="vista === 'vender'" class="caja-sell">
      <div class="caja-catalog">
        <div class="caja-search">
          <input v-model="busqueda" type="search" placeholder="Busca por nombre o escribe un código y presiona Enter" aria-label="Buscar producto o código" @keydown.enter.prevent="buscarEnter">
          <button class="btn btn-ghost" type="button" @click="simularLector">Simular lector</button>
        </div>
        <div class="caja-cats">
          <button v-for="c in categorias" :key="c" type="button" :class="{ on: categoria === c }" @click="categoria = c">{{ c }}</button>
        </div>
        <p v-if="aviso" class="caja-aviso" role="status">{{ aviso }}</p>
        <div class="caja-grid">
          <button
            v-for="p in visibles" :key="p.id" type="button" class="caja-prod"
            :class="{ low: p.stock > 0 && p.stock <= p.minimo, out: p.stock === 0 }"
            :disabled="p.stock === 0 || !!cobrando" @click="agregar(p)"
          >
            <span class="caja-prod-name">{{ p.nombre }}</span>
            <span class="caja-prod-price">{{ clp(p.precio) }}</span>
            <span class="caja-prod-stock">{{ p.stock === 0 ? 'Sin stock' : `Stock: ${p.stock - enTicket(p.id)}` }}</span>
            <span v-if="enTicket(p.id)" class="caja-prod-qty">{{ enTicket(p.id) }}</span>
          </button>
          <p v-if="!visibles.length" class="caja-empty">No hay productos que coincidan.</p>
        </div>
      </div>

      <aside ref="ticketEl" class="caja-ticket" aria-label="Venta actual">
        <div class="caja-ticket-head">
          <b>Venta actual</b>
          <span>{{ unidades }} {{ unidades === 1 ? 'producto' : 'productos' }}</span>
        </div>
        <ul v-if="lineas.length" class="caja-lines">
          <li v-for="l in lineas" :key="l.id">
            <span class="caja-line-name">{{ l.p.nombre }}<small>{{ clp(l.p.precio) }} c/u</small></span>
            <span class="caja-qty">
              <button type="button" :aria-label="`Quitar uno de ${l.p.nombre}`" :disabled="!!cobrando" @click="cambiar(l.id, -1)">−</button>
              <b>{{ l.cant }}</b>
              <button type="button" :aria-label="`Agregar uno de ${l.p.nombre}`" :disabled="!!cobrando" @click="cambiar(l.id, 1)">+</button>
            </span>
            <span class="caja-line-total">{{ clp(l.p.precio * l.cant) }}</span>
          </li>
        </ul>
        <p v-else class="caja-empty">Toca un producto o usa el lector para empezar una venta.</p>

        <div class="caja-totals">
          <div><span>Neto</span><span>{{ clp(neto) }}</span></div>
          <div><span>IVA 19%</span><span>{{ clp(total - neto) }}</span></div>
          <div class="caja-total"><span>Total</span><span>{{ clp(total) }}</span></div>
        </div>

        <div v-if="!cobrando" class="caja-pay">
          <button v-for="m in (['Efectivo', 'Tarjeta', 'Transferencia'] as const)" :key="m" type="button" class="btn" :class="m === 'Efectivo' ? 'btn-primary' : 'btn-ghost'" :disabled="!lineas.length" @click="iniciarCobro(m)">{{ m }}</button>
        </div>
        <div v-else class="caja-charge">
          <template v-if="cobrando === 'Efectivo'">
            <label for="recibido">¿Con cuánto paga?</label>
            <div class="caja-bills">
              <button v-for="b in billetes" :key="b" type="button" :class="{ on: recibido === b }" @click="recibido = b">{{ b === total ? 'Exacto' : clp(b) }}</button>
            </div>
            <input id="recibido" v-model.number="recibido" type="number" inputmode="numeric" min="0" step="100" placeholder="Monto recibido">
            <p class="caja-change" :class="{ bad: recibido !== null && vuelto < 0 }">
              {{ recibido === null ? 'Elige o escribe el monto' : vuelto < 0 ? `Faltan ${clp(-vuelto)}` : `Vuelto: ${clp(vuelto)}` }}
            </p>
          </template>
          <p v-else class="caja-change">{{ cobrando === 'Tarjeta' ? 'Pasa la tarjeta por la máquina de pago (en la demo se aprueba sola).' : 'Muestra los datos de transferencia y confirma cuando llegue el pago.' }}</p>
          <div class="caja-pay">
            <button type="button" class="btn btn-primary" :disabled="recibido === null || vuelto < 0" @click="confirmar">Confirmar y emitir boleta</button>
            <button type="button" class="btn btn-ghost" @click="cobrando = null">Volver</button>
          </div>
        </div>
      </aside>

      <button v-if="lineas.length" type="button" class="caja-mobile-bar btn btn-primary" @click="verTicket">
        Cobrar {{ clp(total) }} · {{ unidades }} {{ unidades === 1 ? 'producto' : 'productos' }}
      </button>
    </div>

    <!-- STOCK -->
    <div v-else-if="vista === 'stock'" class="caja-panel">
      <p class="caja-hint">El stock se descuenta solo con cada venta. Los productos en naranjo están por agotarse; usa “+10” para simular que llegó el proveedor.</p>
      <div class="caja-table-wrap">
        <table class="caja-table">
          <thead><tr><th>Producto</th><th>Código</th><th class="num">Stock</th><th class="num">Mínimo</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id">
              <td>{{ p.nombre }}</td>
              <td class="mono">{{ p.codigo }}</td>
              <td class="num">{{ p.stock }}</td>
              <td class="num">{{ p.minimo }}</td>
              <td>
                <span class="caja-state" :class="p.stock === 0 ? 'out' : p.stock <= p.minimo ? 'low' : 'ok'">
                  {{ p.stock === 0 ? 'Sin stock' : p.stock <= p.minimo ? 'Por agotarse' : 'OK' }}
                </span>
              </td>
              <td><button type="button" class="caja-link" @click="reponer(p)">+10</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CIERRE -->
    <div v-else class="caja-panel">
      <div v-if="cajaCerrada" class="caja-closed" role="status">
        Caja cerrada: {{ cajaCerrada.ventas }} ventas por {{ clp(cajaCerrada.total) }}. En un sistema real, este resumen te llega por correo.
      </div>
      <div class="caja-kpis">
        <div><span>Total del día</span><b>{{ clp(resumen.total) }}</b></div>
        <div><span>Ventas</span><b>{{ resumen.n }}</b></div>
        <div><span>Venta promedio</span><b>{{ clp(resumen.promedio) }}</b></div>
      </div>
      <div class="caja-cols">
        <div>
          <h3>Por medio de pago</h3>
          <ul class="caja-list">
            <li v-for="(v, m) in resumen.porMedio" :key="m"><span>{{ m }}</span><b>{{ clp(v) }}</b></li>
          </ul>
        </div>
        <div>
          <h3>Más vendidos</h3>
          <ol v-if="resumen.top.length" class="caja-list">
            <li v-for="[n, c] in resumen.top" :key="n"><span>{{ n }}</span><b>{{ c }} u.</b></li>
          </ol>
          <p v-else class="caja-empty">Sin ventas todavía.</p>
        </div>
      </div>
      <h3 style="margin-top:24px">Ventas de hoy</h3>
      <ul v-if="ventas.length" class="caja-list">
        <li v-for="v in [...ventas].reverse()" :key="v.n">
          <span><span class="mono">#{{ v.n }} · {{ v.hora }}</span> · {{ v.items.reduce((s, i) => s + i.cant, 0) }} prod. · {{ v.medio }}</span>
          <b>{{ clp(v.total) }}</b>
        </li>
      </ul>
      <p v-else class="caja-empty">No hay ventas abiertas.</p>
      <button type="button" class="btn btn-primary" style="margin-top:20px; justify-self:start" :disabled="!ventas.length" @click="cerrarCaja">Cerrar caja</button>
    </div>

    <!-- BOLETA -->
    <div v-if="boleta" class="caja-modal" role="dialog" aria-modal="true" aria-label="Boleta de ejemplo" @click.self="boleta = null">
      <div class="caja-receipt">
        <p class="caja-receipt-head"><b>ALMACÉN DE EJEMPLO</b><br>Boleta electrónica N° {{ boleta.n }}<br>{{ new Date().toLocaleDateString('es-CL') }} · {{ boleta.hora }}</p>
        <ul>
          <li v-for="i in boleta.items" :key="i.nombre"><span>{{ i.cant }} × {{ i.nombre }}</span><span>{{ clp(i.precio * i.cant) }}</span></li>
        </ul>
        <div class="caja-receipt-total"><span>TOTAL</span><span>{{ clp(boleta.total) }}</span></div>
        <p>Neto {{ clp(Math.round(boleta.total / 1.19)) }} · IVA {{ clp(boleta.total - Math.round(boleta.total / 1.19)) }}</p>
        <p>Pago: {{ boleta.medio }}<template v-if="boleta.recibido !== undefined"> · Recibido {{ clp(boleta.recibido) }} · Vuelto {{ clp(boleta.recibido - boleta.total) }}</template></p>
        <p class="caja-receipt-note">Demostración: no es un documento tributario válido.</p>
        <button type="button" class="btn btn-primary" @click="boleta = null">Nueva venta</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.caja{background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:16px; display:grid; gap:16px}
.caja-top{display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px}
.caja-tabs{display:inline-flex; gap:4px; padding:4px; background:var(--paper); border:1px solid var(--line); border-radius:10px; flex-wrap:wrap}
.caja-tabs button{font:500 var(--s-sm)/1 var(--f-body); padding:10px 14px; border:0; border-radius:7px; background:transparent; color:var(--muted); cursor:pointer; display:inline-flex; align-items:center; gap:6px}
.caja-tabs button[aria-selected="true"]{background:var(--ink); color:var(--paper)}
.caja-badge{background:var(--signal); color:#fff; font:600 11px/1 var(--f-mono); padding:3px 6px; border-radius:999px}
.caja-link{background:none; border:0; color:var(--accent); font:600 var(--s-sm)/1 var(--f-body); cursor:pointer; padding:6px}
.caja-link:hover{text-decoration:underline}

.caja-sell{display:grid; grid-template-columns:1fr 360px; gap:16px; align-items:start}
.caja-catalog{display:grid; gap:12px; min-width:0}
.caja-search{display:flex; gap:8px}
.caja-search input{flex:1; min-width:0}
.caja-search .btn{white-space:nowrap}
.caja-cats{display:flex; gap:6px; flex-wrap:wrap}
.caja-cats button{font:500 var(--s-xs)/1 var(--f-body); padding:8px 12px; border-radius:999px; border:1px solid var(--line); background:var(--paper); color:var(--ink); cursor:pointer}
.caja-cats button.on{border-color:var(--accent); color:var(--accent); background:color-mix(in srgb,var(--accent) 8%,var(--paper))}
.caja-aviso{font-size:var(--s-sm); background:color-mix(in srgb,var(--signal) 12%,var(--surface)); border:1px solid color-mix(in srgb,var(--signal) 40%,var(--line)); border-radius:8px; padding:8px 12px}
.caja-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px}
.caja-prod{position:relative; text-align:left; display:grid; gap:4px; padding:12px; border:1px solid var(--line); border-radius:10px; background:var(--paper); color:var(--ink); cursor:pointer; font:inherit; transition:border-color .15s, transform .1s}
.caja-prod:hover:not(:disabled){border-color:var(--accent)}
.caja-prod:active:not(:disabled){transform:scale(.97)}
.caja-prod:disabled{cursor:not-allowed; opacity:.5}
.caja-prod-name{font-size:var(--s-sm); font-weight:600; line-height:1.25}
.caja-prod-price{font:700 1.05rem/1.1 var(--f-display); font-variant-numeric:tabular-nums}
.caja-prod-stock{font:400 11px/1.2 var(--f-mono); color:var(--muted)}
.caja-prod.low .caja-prod-stock{color:var(--signal); font-weight:500}
.caja-prod-qty{position:absolute; top:-7px; right:-7px; min-width:24px; height:24px; padding:0 6px; border-radius:999px; background:var(--accent); color:var(--accent-ink); font:600 12px/24px var(--f-mono); text-align:center}
.caja-empty{color:var(--muted); font-size:var(--s-sm)}

.caja-ticket{position:sticky; top:84px; display:grid; gap:12px; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:16px; scroll-margin-top:84px}
.caja-ticket-head{display:flex; justify-content:space-between; align-items:baseline; font-size:var(--s-sm)}
.caja-ticket-head span{color:var(--muted); font-family:var(--f-mono); font-size:var(--s-xs)}
.caja-lines{list-style:none; margin:0; padding:0; display:grid; gap:10px; max-height:300px; overflow:auto}
.caja-lines li{display:grid; grid-template-columns:1fr auto auto; gap:10px; align-items:center; font-size:var(--s-sm)}
.caja-line-name{display:grid; line-height:1.25}
.caja-line-name small{color:var(--muted); font:400 11px/1.4 var(--f-mono)}
.caja-line-total{font-variant-numeric:tabular-nums; min-width:68px; text-align:right}
.caja-qty{display:inline-flex; align-items:center; gap:6px}
.caja-qty button{width:28px; height:28px; border-radius:6px; border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer; font:600 16px/1 var(--f-body)}
.caja-qty b{min-width:18px; text-align:center; font-variant-numeric:tabular-nums}
.caja-totals{border-top:1px dashed var(--line); padding-top:10px; display:grid; gap:4px; font-size:var(--s-sm); color:var(--muted); font-variant-numeric:tabular-nums}
.caja-totals div{display:flex; justify-content:space-between}
.caja-total{color:var(--ink); font:700 1.5rem/1.2 var(--f-display); margin-top:4px}
.caja-pay{display:flex; flex-wrap:wrap; gap:8px}
.caja-pay .btn{flex:1; justify-content:center}
.caja-pay .btn:disabled{cursor:not-allowed}
.caja-charge{display:grid; gap:10px}
.caja-charge label{font-size:var(--s-sm); font-weight:600}
.caja-bills{display:flex; flex-wrap:wrap; gap:6px}
.caja-bills button{flex:1; font:500 var(--s-sm)/1 var(--f-mono); padding:10px 8px; border-radius:8px; border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer}
.caja-bills button.on{border-color:var(--accent); color:var(--accent)}
.caja-change{font-size:var(--s-sm); font-weight:600; color:var(--accent)}
.caja-change.bad{color:var(--err)}
.caja-mobile-bar{display:none}

.caja-panel{display:grid; gap:12px}
.caja-hint{font-size:var(--s-sm); color:var(--muted)}
.caja-table-wrap{overflow-x:auto; border:1px solid var(--line); border-radius:10px}
.caja-table{width:100%; border-collapse:collapse; font-size:var(--s-sm)}
.caja-table th,.caja-table td{padding:10px 12px; text-align:left; border-bottom:1px solid var(--line); white-space:nowrap}
.caja-table th{font:500 var(--s-xs)/1 var(--f-mono); color:var(--muted); text-transform:uppercase; letter-spacing:.05em; background:var(--paper)}
.caja-table tr:last-child td{border-bottom:0}
.caja-table .num{text-align:right; font-variant-numeric:tabular-nums}
.mono{font-family:var(--f-mono); font-size:var(--s-xs); color:var(--muted)}
.caja-state{font:500 11px/1 var(--f-mono); padding:4px 8px; border-radius:999px; border:1px solid var(--line)}
.caja-state.ok{color:var(--ok); border-color:color-mix(in srgb,var(--ok) 40%,var(--line))}
.caja-state.low{color:var(--signal); border-color:color-mix(in srgb,var(--signal) 50%,var(--line))}
.caja-state.out{color:var(--err); border-color:color-mix(in srgb,var(--err) 50%,var(--line))}

.caja-closed{font-size:var(--s-sm); background:color-mix(in srgb,var(--ok) 12%,var(--surface)); border:1px solid color-mix(in srgb,var(--ok) 40%,var(--line)); border-radius:8px; padding:12px}
.caja-kpis{display:grid; grid-template-columns:repeat(3,1fr); gap:10px}
.caja-kpis div{background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px; display:grid; gap:4px}
.caja-kpis span{font:400 var(--s-xs)/1.2 var(--f-mono); color:var(--muted)}
.caja-kpis b{font:700 1.4rem/1.1 var(--f-display); font-variant-numeric:tabular-nums}
.caja-cols{display:grid; grid-template-columns:1fr 1fr; gap:24px}
.caja-panel h3{font-size:1.1rem; margin-bottom:8px}
.caja-list{list-style:none; margin:0; padding:0; display:grid; font-size:var(--s-sm)}
.caja-list li{display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px solid var(--line)}
.caja-list b{font-weight:600; font-variant-numeric:tabular-nums; white-space:nowrap}

.caja-modal{position:fixed; inset:0; z-index:20; background:rgb(0 0 0 / .45); display:grid; place-items:center; padding:16px}
.caja-receipt{width:min(340px,100%); background:#fffdf8; color:#1F2A24; border-radius:4px; padding:22px 20px; font:400 13px/1.5 var(--f-mono); display:grid; gap:10px; box-shadow:0 20px 50px rgb(0 0 0 / .3)}
.caja-receipt-head{text-align:center; border-bottom:1px dashed #bbb; padding-bottom:10px}
.caja-receipt ul{list-style:none; margin:0; padding:0; display:grid; gap:4px}
.caja-receipt li,.caja-receipt-total{display:flex; justify-content:space-between; gap:10px}
.caja-receipt-total{border-top:1px dashed #bbb; padding-top:8px; font-weight:700; font-size:15px}
.caja-receipt-note{font-size:11px; color:#8a6a55; text-align:center; border-top:1px dashed #bbb; padding-top:8px}
.caja-receipt .btn{justify-content:center; font-family:var(--f-body)}

@media (max-width:900px){
  .caja-sell{grid-template-columns:1fr}
  .caja-ticket{position:static}
  .caja-mobile-bar{display:flex; justify-content:center; position:sticky; bottom:12px; z-index:4; box-shadow:0 8px 24px rgb(0 0 0 / .2)}
}
@media (max-width:560px){
  .caja{padding:12px}
  .caja-search{flex-direction:column}
  .caja-grid{grid-template-columns:repeat(2,1fr)}
  .caja-kpis{grid-template-columns:1fr 1fr}
  .caja-kpis div:first-child{grid-column:1 / -1}
  .caja-cols{grid-template-columns:1fr}
}
</style>
