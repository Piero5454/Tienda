<script setup lang="ts">
type Kind = 'web' | 'app' | 'dash'

const tabs: { k: Kind; label: string; dim: string; note: string }[] = [
  { k: 'web', label: 'Web', dim: '1440 px · escritorio', note: 'Ejemplo: sitio para un negocio local, con catálogo y contacto.' },
  { k: 'app', label: 'App', dim: '390 px · móvil', note: 'Ejemplo: app de pedidos y agenda para el día a día.' },
  { k: 'dash', label: 'Dashboard', dim: '1280 px · panel interno', note: 'Ejemplo: panel de ventas y stock con datos ficticios.' }
]

const active = ref<Kind>('web')
const current = computed(() => tabs.find(t => t.k === active.value)!)
</script>

<template>
  <header class="hero" id="inicio">
    <div class="wrap">
      <div>
        <p class="label">Desarrollo a medida · Chile</p>
        <h1 style="margin-top:16px">Tu idea, construida como <em>web, app</em> o dashboard.</h1>
        <p class="lede">Diseño y programo herramientas digitales que tu negocio usa todos los días. Sin plantillas genéricas y con un precio cerrado desde el inicio.</p>
        <div class="cta">
          <a class="btn btn-primary" href="#contacto">Cuéntame tu proyecto →</a>
          <a class="btn btn-ghost" href="#servicios">Ver qué hago</a>
        </div>
        <div class="meta">
          <span>Respuesta en 24 h hábiles</span>
          <span>Presupuesto en CLP + IVA</span>
          <span>Código y dominio a tu nombre</span>
        </div>
      </div>

      <div class="studio">
        <div class="tabs" role="tablist" aria-label="Tipo de proyecto">
          <button
            v-for="t in tabs"
            :key="t.k"
            :id="`tab-${t.k}`"
            role="tab"
            :aria-selected="active === t.k ? 'true' : 'false'"
            :aria-controls="`f-${t.k}`"
            @click="active = t.k"
          >{{ t.label }}</button>
        </div>
        <div class="stage">
          <div class="dim top">{{ current.dim }}</div>

          <div class="frame" :class="{ on: active === 'web' }" id="f-web" role="tabpanel" aria-labelledby="tab-web">
            <div class="browser">
              <div class="bar"><b></b><b></b><b></b><span class="url">https://www.tunegocio.cl</span></div>
              <div class="site">
                <div class="h"></div>
                <div class="h2"></div>
                <div class="row"><div class="pill"></div><div class="pill alt"></div></div>
                <div class="cards"><div></div><div></div><div></div></div>
              </div>
            </div>
          </div>

          <div class="frame" :class="{ on: active === 'app' }" id="f-app" role="tabpanel" aria-labelledby="tab-app">
            <div class="phones">
              <div class="phone">
                <div class="t">Pedidos de hoy</div>
                <div class="bal">$486.900</div>
                <ul>
                  <li><span>#1042 Retiro</span><span>$32.500</span></li>
                  <li><span>#1041 Despacho</span><span>$58.990</span></li>
                  <li><span>#1040 Retiro</span><span>$12.400</span></li>
                  <li><span>#1039 Despacho</span><span>$74.000</span></li>
                </ul>
                <div class="tabbar"><i></i><i></i><i></i><i></i></div>
              </div>
              <div class="phone">
                <div class="t">Agenda</div>
                <div class="bal">7 citas</div>
                <ul>
                  <li><span>09:30</span><span>Confirmada</span></li>
                  <li><span>11:00</span><span>Confirmada</span></li>
                  <li><span>15:15</span><span>Pendiente</span></li>
                </ul>
                <div class="tabbar"><i></i><i></i><i></i></div>
              </div>
            </div>
          </div>

          <div class="frame" :class="{ on: active === 'dash' }" id="f-dash" role="tabpanel" aria-labelledby="tab-dash">
            <div class="browser">
              <div class="bar"><b></b><b></b><b></b><span class="url">panel.tunegocio.cl/ventas</span></div>
              <div class="dash">
                <div class="kpi"><small>Ventas mes</small><strong>$12,4 M</strong><em>▲ 8,2%</em></div>
                <div class="kpi"><small>Ticket prom.</small><strong>$38.600</strong><em>▲ 3,1%</em></div>
                <div class="kpi"><small>Stock bajo</small><strong>14 SKU</strong><em style="color:var(--signal)">Revisar</em></div>
                <div class="chart">
                  <svg viewBox="0 0 320 150" preserveAspectRatio="none" aria-label="Gráfico de ejemplo de ventas semanales">
                    <g stroke="var(--line)" stroke-width="1">
                      <line x1="0" y1="30" x2="320" y2="30" /><line x1="0" y1="70" x2="320" y2="70" /><line x1="0" y1="110" x2="320" y2="110" />
                    </g>
                    <path d="M0,120 L40,108 L80,112 L120,90 L160,94 L200,70 L240,62 L280,44 L320,36 L320,150 L0,150 Z" fill="var(--accent)" opacity=".14" />
                    <path d="M0,120 L40,108 L80,112 L120,90 L160,94 L200,70 L240,62 L280,44 L320,36" fill="none" stroke="var(--accent)" stroke-width="2.5" vector-effect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="stage-note">{{ current.note }}</p>
      </div>
    </div>
  </header>
</template>
