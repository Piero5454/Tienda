<script setup lang="ts">
// Edita estos datos con tu información real
const WHATSAPP = '56900000000'
const contact = {
  email: 'hola@tudominio.cl',
  phone: '+56 9 0000 0000',
  hours: 'Lun a vie, 9:00 a 18:00'
}

const tipos = [
  { id: 't-web', value: 'Sitio web' },
  { id: 't-app', value: 'App' },
  { id: 't-dash', value: 'Dashboard' }
]

const form = reactive({
  nombre: '',
  empresa: '',
  tipos: ['Sitio web'] as string[],
  mensaje: ''
})

const nombreInput = ref<HTMLInputElement | null>(null)
const error = ref('')
const mensajeListo = ref('')

const waLink = computed(() => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensajeListo.value)}`)

function onSubmit() {
  const nombre = form.nombre.trim()
  if (!nombre) {
    mensajeListo.value = ''
    error.value = 'Escribe tu nombre para preparar el mensaje.'
    nombreInput.value?.focus()
    return
  }
  error.value = ''
  const empresa = form.empresa.trim()
  const mensaje = form.mensaje.trim()
  mensajeListo.value =
    `Hola, soy ${nombre}${empresa ? ` de ${empresa}` : ''}. ` +
    `Me interesa: ${form.tipos.join(', ') || 'un proyecto digital'}.` +
    (mensaje ? ` ${mensaje}` : '')
}
</script>

<template>
  <section id="contacto">
    <div class="wrap contact">
      <div>
        <p class="label">Contacto</p>
        <h2 style="margin-top:12px">Cuéntame qué necesitas y te respondo con una propuesta</h2>
        <div class="direct">
          <div><span class="label">Correo</span><strong>{{ contact.email }}</strong></div>
          <div><span class="label">WhatsApp</span><strong>{{ contact.phone }}</strong></div>
          <div><span class="label">Horario</span><strong>{{ contact.hours }}</strong></div>
        </div>
      </div>
      <form novalidate @submit.prevent="onSubmit">
        <div class="field">
          <label for="nombre">Nombre</label>
          <input id="nombre" ref="nombreInput" v-model="form.nombre" name="nombre" autocomplete="name" placeholder="Ej: Camila Rojas" required>
        </div>
        <div class="field">
          <label for="empresa">Empresa o emprendimiento</label>
          <input id="empresa" v-model="form.empresa" name="empresa" autocomplete="organization" placeholder="Ej: Ferretería Los Andes">
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
          <textarea id="mensaje" v-model="form.mensaje" name="mensaje" placeholder="Ej: Quiero una tienda online para vender mis productos con despacho a regiones."></textarea>
        </div>
        <button class="btn btn-primary" type="submit" style="justify-self:start">Preparar mensaje</button>
        <div v-if="error" class="result" aria-live="polite">{{ error }}</div>
        <div v-else-if="mensajeListo" class="result" aria-live="polite">
          <p>Tu mensaje está listo:</p>
          <p style="color:var(--muted)">“{{ mensajeListo }}”</p>
          <a :href="waLink" target="_blank" rel="noopener">Enviar por WhatsApp →</a>
        </div>
      </form>
    </div>
  </section>
</template>
