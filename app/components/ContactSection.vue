<script setup lang="ts">
// Correo donde llegan los mensajes del formulario (vía FormSubmit.co).
// La primera vez que alguien envíe el formulario, FormSubmit manda un correo
// de activación a esta dirección: hay que confirmarlo para empezar a recibir mensajes.
const EMAIL = 'piero5454@gmail.com'

const tipos = [
  { id: 't-web', value: 'Sitio web' },
  { id: 't-app', value: 'App' },
  { id: 't-pos', value: 'Punto de venta' }
]

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  empresa: '',
  tipos: ['Sitio web'] as string[],
  mensaje: '',
  honey: ''
})

const nombreInput = ref<HTMLInputElement | null>(null)
const correoInput = ref<HTMLInputElement | null>(null)
const estado = ref<'idle' | 'enviando' | 'ok' | 'error'>('idle')
const aviso = ref('')

const correoValido = (c: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)

async function onSubmit() {
  const nombre = form.nombre.trim()
  const correo = form.correo.trim()
  if (!nombre) {
    estado.value = 'error'
    aviso.value = 'Escribe tu nombre para enviar el mensaje.'
    nombreInput.value?.focus()
    return
  }
  if (!correoValido(correo)) {
    estado.value = 'error'
    aviso.value = 'Escribe un correo válido para poder responderte.'
    correoInput.value?.focus()
    return
  }

  estado.value = 'enviando'
  aviso.value = ''
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Nuevo contacto web: ${nombre}`,
        _template: 'table',
        _replyto: correo,
        _honey: form.honey,
        Nombre: nombre,
        Correo: correo,
        Teléfono: form.telefono.trim() || '—',
        Empresa: form.empresa.trim() || '—',
        Necesita: form.tipos.join(', ') || 'Sin especificar',
        Mensaje: form.mensaje.trim() || '—'
      })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.success === 'false' || data.success === false) throw new Error(data.message)
    estado.value = 'ok'
    aviso.value = `¡Gracias, ${nombre}! Recibí tu mensaje y te responderé a ${correo} dentro de 24 horas hábiles.`
    Object.assign(form, { nombre: '', correo: '', telefono: '', empresa: '', mensaje: '', tipos: ['Sitio web'] })
  } catch {
    estado.value = 'error'
    aviso.value = 'No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo en unos minutos.'
  }
}
</script>

<template>
  <section id="contacto">
    <div class="wrap contact">
      <div>
        <p class="label">Contacto</p>
        <h2 style="margin-top:12px">Cuéntame qué necesitas y te respondo con una propuesta</h2>
        <p class="intro">Completa el formulario y te escribo a tu correo con los próximos pasos.</p>
        <ul class="perks">
          <li>Respuesta en 24 horas hábiles</li>
          <li>Primera reunión sin costo</li>
          <li>Presupuesto cerrado en pesos chilenos</li>
        </ul>
      </div>
      <form novalidate @submit.prevent="onSubmit">
        <div class="field">
          <label for="nombre">Nombre</label>
          <input id="nombre" ref="nombreInput" v-model="form.nombre" name="nombre" autocomplete="name" placeholder="Ej: Camila Rojas" required>
        </div>
        <div class="field">
          <label for="correo">Correo</label>
          <input id="correo" ref="correoInput" v-model="form.correo" type="email" name="correo" autocomplete="email" placeholder="Ej: camila@correo.cl" required>
        </div>
        <div class="field">
          <label for="telefono">Teléfono (opcional)</label>
          <input id="telefono" v-model="form.telefono" type="tel" name="telefono" autocomplete="tel" placeholder="Ej: +56 9 1234 5678">
        </div>
        <div class="field">
          <label for="empresa">Negocio o emprendimiento</label>
          <input id="empresa" v-model="form.empresa" name="empresa" autocomplete="organization" placeholder="Ej: Almacén Los Andes">
        </div>
        <fieldset class="field" style="border:0; padding:0; margin:0">
          <legend style="font-size:var(--s-sm); font-weight:600; margin-bottom:6px">¿Qué necesitas?</legend>
          <div class="chips">
            <label v-for="t in tipos" :key="t.id">
              <input :id="t.id" v-model="form.tipos" type="checkbox" name="tipo" :value="t.value">{{ t.value }}
            </label>
          </div>
        </fieldset>
        <div class="field">
          <label for="mensaje">Cuéntame tu idea</label>
          <textarea id="mensaje" v-model="form.mensaje" name="mensaje" placeholder="Ej: Tengo un minimarket y quiero una caja que controle el stock y emita boletas."></textarea>
        </div>
        <!-- Campo trampa para bots: las personas no lo ven -->
        <div class="hp" aria-hidden="true">
          <label for="_honey">No llenar</label>
          <input id="_honey" v-model="form.honey" name="_honey" tabindex="-1" autocomplete="off">
        </div>
        <button class="btn btn-primary" type="submit" style="justify-self:start" :disabled="estado === 'enviando'">
          {{ estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje' }}
        </button>
        <div v-if="aviso" class="result" :class="{ error: estado === 'error' }" role="status" aria-live="polite">{{ aviso }}</div>
      </form>
    </div>
  </section>
</template>
