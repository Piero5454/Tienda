<script setup lang="ts">
type Kind = 'web' | 'app' | 'pos'

const tabs: { k: Kind; label: string }[] = [
  { k: 'web', label: 'Web' },
  { k: 'app', label: 'App' },
  { k: 'pos', label: 'Punto de venta' }
]

const products = [
  { n: 'Pan amasado', v: '$900', sel: true },
  { n: 'Leche 1 L', v: '$1.190', sel: true },
  { n: 'Café 250 g', v: '$4.990', sel: true },
  { n: 'Huevos x12', v: '$3.600' },
  { n: 'Arroz 1 kg', v: '$1.490' },
  { n: 'Bebida 1,5 L', v: '$1.790' },
  { n: 'Aceite 1 L', v: '$2.990' },
  { n: 'Azúcar 1 kg', v: '$1.250' },
  { n: 'Fideos 400 g', v: '$890' }
]

const active = ref<Kind>('web')
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

          <div class="frame" :class="{ on: active === 'pos' }" id="f-pos" role="tabpanel" aria-labelledby="tab-pos">
            <div class="browser">
              <div class="bar"><b></b><b></b><b></b><span class="url">Caja 1 · Almacén Don Pedro</span></div>
              <div class="pos">
                <div class="grid">
                  <div v-for="p in products" :key="p.n" class="item" :class="{ sel: p.sel }"><b>{{ p.n }}</b><span>{{ p.v }}</span></div>
                </div>
                <div class="ticket">
                  <div class="t">Venta actual</div>
                  <ul>
                    <li><span>2 × Pan amasado</span><span>$1.800</span></li>
                    <li><span>1 × Leche 1 L</span><span>$1.190</span></li>
                    <li><span>1 × Café 250 g</span><span>$4.990</span></li>
                  </ul>
                  <div class="total"><span>Total</span><span>$7.980</span></div>
                  <div class="pay">Cobrar · Boleta</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
