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

const origenes = [
  'Google',
  'Instagram o Facebook',
  'Recomendación de alguien',
  'WhatsApp',
  'Otro'
]

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  empresa: '',
  tipos: ['Sitio web'] as string[],
  mensaje: '',
  origen: '',
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

  const datos: Record<string, string> = {
    _subject: `Nuevo contacto web: ${nombre}`,
    _template: 'table',
    _captcha: 'false',
    _replyto: correo,
    _honey: form.honey,
    Nombre: nombre,
    Correo: correo,
    Teléfono: form.telefono.trim() || '—',
    Empresa: form.empresa.trim() || '—',
    Necesita: form.tipos.join(', ') || 'Sin especificar',
    Mensaje: form.mensaje.trim() || '—',
    'Nos conoció por': form.origen || 'Sin especificar'
  }

  estado.value = 'enviando'
  aviso.value = ''

  let data: { success?: string | boolean; message?: string }
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(datos)
    })
    data = await res.json()
  } catch {
    // La petición en segundo plano fue bloqueada (Cloudflare, CORS, red):
    // se envía como formulario tradicional, que FormSubmit siempre acepta.
    envioTradicional(datos)
    return
  }

  if (data.success === true || data.success === 'true') {
    estado.value = 'ok'
    aviso.value = `¡Gracias, ${nombre}! Recibí tu mensaje y te responderé a ${correo} dentro de 24 horas hábiles.`
    Object.assign(form, { nombre: '', correo: '', telefono: '', empresa: '', mensaje: '', origen: '', tipos: ['Sitio web'] })
    return
  }

  estado.value = 'error'
  aviso.value = /activat/i.test(data.message || '')
    ? 'El formulario aún no está activado. Revisa el correo de FormSubmit en la bandeja del dueño del sitio (y en spam) y haz clic en "Activate Form".'
    : `No se pudo enviar el mensaje${data.message ? `: ${data.message}` : ''}. Inténtalo de nuevo en unos minutos.`
}

function envioTradicional(datos: Record<string, string>) {
  const f = document.createElement('form')
  f.method = 'POST'
  f.action = `https://formsubmit.co/${EMAIL}`
  const volver = new URL(window.location.href)
  volver.hash = 'contacto'
  volver.searchParams.set('enviado', '1')
  for (const [name, value] of Object.entries({ ...datos, _next: volver.toString() })) {
    const i = document.createElement('input')
    i.type = 'hidden'
    i.name = name
    i.value = value
    f.appendChild(i)
  }
  document.body.appendChild(f)
  f.submit()
}

// Al volver del envío tradicional, FormSubmit redirige con ?enviado=1
onMounted(() => {
  const url = new URL(window.location.href)
  if (url.searchParams.get('enviado') === '1') {
    estado.value = 'ok'
    aviso.value = '¡Gracias! Recibí tu mensaje y te responderé dentro de 24 horas hábiles.'
    url.searchParams.delete('enviado')
    history.replaceState(null, '', url.toString())
  }
})
</script>

<template>
  <section id="contacto">
    <div class="wrap contact">
      <div>
        <p class="label">Contacto</p>
        <h2 style="margin-top:12px">Cuéntame qué necesitas y te respondo con una propuesta</h2>
        <p class="intro">Cuéntame en pocas palabras qué te gustaría lograr. Te escribo para agendar una conversación y, después, te envío una propuesta con precio y plazos.</p>
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
        <div class="field">
          <label for="origen">¿Cómo llegaste aquí? (opcional)</label>
          <select id="origen" v-model="form.origen" name="origen">
            <option value="">Elige una opción</option>
            <option v-for="o in origenes" :key="o" :value="o">{{ o }}</option>
          </select>
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
