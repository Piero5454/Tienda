// Precios del cotizador en CLP + IVA (estimados). Ajusta aquí los valores.
// Deben ser coherentes con los "desde" publicados en ServicesSection.vue y shared/rubros.ts.

export type Solucion = 'pos' | 'reservas' | 'tienda' | 'web' | 'app'

export const soluciones: Record<Solucion, { nombre: string; tipoFormulario: string; rango: [number, number] | null; incluye: string[] }> = {
  pos: { nombre: 'Punto de venta', tipoFormulario: 'Punto de venta', rango: [450000, 650000], incluye: ['Boleta electrónica y pago con tarjeta', 'Control de stock y cierre de caja', 'Carga inicial de tus productos', '30 días de soporte'] },
  reservas: { nombre: 'Web con reservas', tipoFormulario: 'Sitio web', rango: [250000, 450000], incluye: ['Reserva de horas 24/7', 'Recordatorios automáticos por correo', 'Agenda por profesional', '30 días de soporte'] },
  tienda: { nombre: 'Tienda online', tipoFormulario: 'Sitio web', rango: [250000, 450000], incluye: ['Catálogo editable por ti', 'Pago con Webpay, Mercado Pago o Flow', 'Carga inicial de productos', '30 días de soporte'] },
  web: { nombre: 'Página web informativa', tipoFormulario: 'Sitio web', rango: [250000, 350000], incluye: ['Diseño a medida que se ve bien en celular', 'Lista para Google y Google Maps', 'Botón a WhatsApp', '30 días de soporte'] },
  app: { nombre: 'App propia (iPhone y Android)', tipoFormulario: 'App', rango: null, incluye: ['Publicación en App Store y Google Play', 'Avisos al celular y cuentas de usuario', 'Diseño y alcance definidos contigo'] }
}

export const EXTRA = {
  cajaAdicional: 100000, // por cada caja o sucursal sobre la primera
  muchosProductos: 50000, // más de 500 productos
  muchosProfesionales: 80000 // más de 3 profesionales
}

export const negocios = [
  { id: 'almacen', nombre: 'Almacén o minimarket', icono: '🛒', sugiere: 'pos' as Solucion },
  { id: 'belleza', nombre: 'Peluquería, barbería o estética', icono: '💈', sugiere: 'reservas' as Solucion },
  { id: 'comida', nombre: 'Pastelería, cafetería o comida', icono: '🧁', sugiere: 'tienda' as Solucion },
  { id: 'otro', nombre: 'Otro comercio o servicio', icono: '🏪', sugiere: 'web' as Solucion }
]
