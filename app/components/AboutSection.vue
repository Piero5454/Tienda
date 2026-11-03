<script setup lang="ts">
// Edita estos datos con tu información real.
// Para la foto: guarda una imagen cuadrada en public/ (por ejemplo public/yo.jpg)
// y escribe aquí su nombre: foto: 'yo.jpg'. Si queda vacío se muestra el logo.
const yo = {
  nombre: 'Plano Digital',
  rol: 'Desarrollador web y de aplicaciones',
  foto: '',
  parrafos: [
    'Creo páginas web, apps y sistemas de caja para pequeños negocios: almacenes, minimarkets, cafeterías, talleres y emprendimientos que quieren vender más y ordenarse sin complicarse.',
    'Trabajo de forma independiente, así que hablas directo conmigo desde la primera conversación hasta la entrega. Te explico todo sin tecnicismos y construyo solo lo que tu negocio realmente necesita.'
  ],
  valores: [
    { t: 'Trato directo', d: 'Sin intermediarios ni vendedores: la persona que te cotiza es la misma que programa.' },
    { t: 'Sin tecnicismos', d: 'Te explico cada decisión en palabras simples para que siempre sepas qué estás pagando.' },
    { t: 'Acompañamiento', d: 'No desaparezco después de la entrega: te enseño a usarlo y sigo disponible.' }
  ]
}

const config = useRuntimeConfig()
const fotoUrl = computed(() => (yo.foto ? `${config.app.baseURL}${yo.foto}` : ''))
</script>

<template>
  <section id="sobre-mi">
    <div class="wrap about">
      <div class="about-id">
        <img v-if="fotoUrl" :src="fotoUrl" :alt="`Foto del desarrollador de ${yo.nombre}`" class="about-photo" width="160" height="160" loading="lazy">
        <div v-else class="about-photo about-initial" aria-hidden="true"><i></i></div>
        <div>
          <strong class="about-name">{{ yo.nombre }}</strong>
          <span class="label">{{ yo.rol }}</span>
        </div>
      </div>
      <div>
        <p class="label">Sobre mí</p>
        <h2 style="margin-top:12px">Una persona detrás de tu proyecto, no una agencia</h2>
        <div class="about-text">
          <p v-for="p in yo.parrafos" :key="p">{{ p }}</p>
        </div>
        <ul class="about-values">
          <li v-for="v in yo.valores" :key="v.t">
            <b>{{ v.t }}</b>
            <span>{{ v.d }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
