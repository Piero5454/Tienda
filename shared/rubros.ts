// Páginas por rubro (una por tipo de negocio). Cada entrada genera /<slug>
// con su propio título y descripción para Google, y se agrega sola al sitemap.
// Para sumar un rubro nuevo, copia un bloque, cambia el slug y los textos.
// Precios en CLP sin IVA: ajústalos a tus valores reales ('' muestra "A cotizar").

export interface Rubro {
  slug: string
  nombre: string // cómo se nombra en enlaces: "Almacenes y minimarkets"
  seoTitle: string
  seoDescription: string
  label: string
  h1: string
  h1Destacado: string // parte del h1 que va resaltada
  lede: string
  tipo: 'Sitio web' | 'App' | 'Punto de venta' // opción marcada en el formulario
  solucion: string
  precio: string
  plazo: string
  resumen: string[]
  dolores: { t: string; d: string }[]
  incluye: { t: string; d: string }[]
  faqs: { q: string; a: string }[]
  mensajeEjemplo: string
}

export const rubros: Rubro[] = [
  {
    slug: 'almacenes',
    nombre: 'Almacenes y minimarkets',
    seoTitle: 'Sistema de caja y punto de venta para almacenes y minimarkets en Chile · Plano Digital',
    seoDescription: 'Punto de venta para almacenes, minimarkets y botillerías: boleta electrónica, pago con tarjeta, control de stock y cierre de caja en un clic. Precio cerrado, desde $450.000 + IVA.',
    label: 'Para almacenes y minimarkets',
    h1: 'Un sistema de caja para tu almacén que',
    h1Destacado: 'cuadra solo',
    lede: 'Cobra rápido con lector de código de barras, emite boleta, descuenta el stock en cada venta y cierra la caja en un clic. Sin cuadernos y sin sorpresas a fin de mes.',
    tipo: 'Punto de venta',
    solucion: 'Punto de venta',
    precio: '$450.000',
    plazo: '2 a 5 semanas',
    resumen: ['Funciona en computador, tablet o celular', 'Boleta electrónica y pago con tarjeta', 'Stock al día con aviso de quiebre', 'Cargo tus productos desde Excel'],
    dolores: [
      { t: 'Las ventas se anotan a mano', d: 'Cuaderno, calculadora y memoria. Al final del día no sabes bien cuánto vendiste ni qué se llevó cada cliente.' },
      { t: 'Te enteras tarde de lo que falta', d: 'El cliente pide algo y ya no queda. Haces los pedidos al proveedor “al ojo” y a veces compras de más.' },
      { t: 'Cuadrar la caja toma media hora', d: 'Contar billetes, sumar vouchers y buscar la diferencia cada noche, cuando lo único que quieres es cerrar.' }
    ],
    incluye: [
      { t: 'Cobro rápido', d: 'Lector de código de barras, búsqueda por nombre y botones para lo que más vendes, como el pan o las bebidas.' },
      { t: 'Boleta y medios de pago', d: 'Boleta electrónica y pago con tarjeta mediante Transbank, Mercado Pago o SumUp. También efectivo y transferencia.' },
      { t: 'Stock que se descuenta solo', d: 'Cada venta rebaja el inventario y el sistema te avisa cuando un producto está por agotarse.' },
      { t: 'Cierre de caja en un clic', d: 'Ves cuánto entró por cada medio de pago y si la caja cuadra, sin sumar a mano.' },
      { t: 'Ventas y productos más vendidos', d: 'Un resumen diario y mensual para saber qué conviene comprar más y qué no se está moviendo.' },
      { t: 'Más de una caja o usuario', d: 'Si atienden varias personas, cada una entra con su clave y sabes quién vendió qué.' }
    ],
    faqs: [
      { q: '¿Tengo que comprar equipos nuevos?', a: 'Casi nunca. Funciona en el computador, tablet o celular que ya tengas. Si te falta un lector de código de barras o una impresora de boletas, te recomiendo modelos económicos que se consiguen en Chile.' },
      { q: '¿Sirve para boleta electrónica del SII?', a: 'Sí. Se conecta con un proveedor de boleta electrónica autorizado por el SII, y si ya trabajas con uno, vemos cómo integrarlo.' },
      { q: '¿Qué pasa si se corta internet?', a: 'Puedes seguir vendiendo. Las ventas se guardan en el equipo y se sincronizan cuando vuelve la conexión.' },
      { q: '¿Quién carga los productos?', a: 'Yo. Si tienes tu lista en Excel o en otro sistema, la importo. Si no tienes nada, te paso una planilla simple para llenar.' }
    ],
    mensajeEjemplo: 'Ej: Tengo un almacén con unos 800 productos y quiero dejar el cuaderno, emitir boletas y saber qué me falta.'
  },
  {
    slug: 'pastelerias',
    nombre: 'Pastelerías y repostería',
    seoTitle: 'Página web y tienda online para pastelerías en Chile · Plano Digital',
    seoDescription: 'Tienda online para pastelerías y repostería: catálogo de tortas, pedidos con fecha de retiro o despacho, pago con Webpay y pedidos ordenados en un solo lugar. Desde $250.000 + IVA.',
    label: 'Para pastelerías y repostería',
    h1: 'Tu pastelería con pedidos online,',
    h1Destacado: 'sin perder ni uno',
    lede: 'Una página con tu catálogo, donde el cliente elige la torta, la fecha de retiro o despacho y paga en línea. Los pedidos te llegan ordenados, no repartidos entre WhatsApp e Instagram.',
    tipo: 'Sitio web',
    solucion: 'Tienda online',
    precio: '$250.000',
    plazo: '3 a 4 semanas',
    resumen: ['Catálogo que editas tú', 'Pago con Webpay, Mercado Pago o Flow', 'Fecha de retiro o despacho', 'Aparece en Google y Google Maps'],
    dolores: [
      { t: 'Los pedidos llegan por todos lados', d: 'WhatsApp, Instagram, mensajes de voz. Algún pedido se pierde o se anota con la fecha equivocada.' },
      { t: 'Respondes lo mismo todo el día', d: '“¿Cuánto cuesta la torta de 20 personas?”, “¿Hacen sin azúcar?”. Pasas más tiempo contestando que horneando.' },
      { t: 'Confirmar pagos es un enredo', d: 'Hay que revisar cada transferencia, pedir el comprobante y perseguir a quien reservó y no pagó.' }
    ],
    incluye: [
      { t: 'Catálogo con fotos y precios', d: 'Tortas, kuchenes, cajas de dulces o lo que hagas, con tamaños y sabores a elegir. Tú cambias fotos y precios cuando quieras.' },
      { t: 'Pedidos con fecha', d: 'El cliente elige el día de retiro o despacho y tú defines con cuánta anticipación se puede pedir y cuántos pedidos aceptas por día.' },
      { t: 'Pago en línea', d: 'Webpay, Mercado Pago o Flow. El pedido se confirma solo cuando está pagado.' },
      { t: 'Todo en un solo lugar', d: 'Ves los pedidos del día y de la semana ordenados, con lo que lleva cada uno. Te llega un aviso por correo con cada pedido nuevo.' },
      { t: 'Botón a WhatsApp', d: 'Para pedidos especiales, como tortas de matrimonio o diseños personalizados, el cliente te escribe directo.' },
      { t: 'Te encuentran en Google', d: 'Dejo tu negocio listo en Google Maps y en búsquedas como “pastelería en tu comuna”.' }
    ],
    faqs: [
      { q: '¿Puedo seguir recibiendo pedidos por WhatsApp?', a: 'Sí. La página no reemplaza WhatsApp: ordena los pedidos normales y deja WhatsApp para los especiales.' },
      { q: '¿Cuánto cobran Webpay o Mercado Pago?', a: 'Cobran una comisión por venta, que depende del proveedor y del plan. Te ayudo a elegir el que te convenga según cuánto vendes.' },
      { q: '¿Puedo poner un límite de pedidos por día?', a: 'Sí. Defines cuántos pedidos aceptas por día y con cuánta anticipación. Cuando se llena un día, la página ofrece el siguiente.' },
      { q: '¿Necesito saber de computación para actualizarla?', a: 'No. Cambiar una foto o un precio es como publicar en Instagram. Te dejo un video corto explicando cómo hacerlo.' }
    ],
    mensajeEjemplo: 'Ej: Hago tortas y kuchenes desde mi casa y quiero que los clientes pidan y paguen online con fecha de retiro.'
  },
  {
    slug: 'peluquerias',
    nombre: 'Peluquerías, barberías y salones',
    seoTitle: 'Página web con reserva de horas para peluquerías y barberías en Chile · Plano Digital',
    seoDescription: 'Página web con agenda online para peluquerías, barberías, salones de belleza y centros de estética: el cliente reserva su hora, recibe un recordatorio y tú ves tu agenda en el celular.',
    label: 'Para peluquerías y barberías',
    h1: 'Reservas online para tu peluquería,',
    h1Destacado: 'sin el teléfono',
    lede: 'Tus clientes eligen el servicio, el profesional y la hora desde el celular, a cualquier hora. Reciben un recordatorio y tú ves la agenda del día en un vistazo.',
    tipo: 'Sitio web',
    solucion: 'Web con reservas',
    precio: '$250.000',
    plazo: '3 a 5 semanas',
    resumen: ['Reserva de horas 24/7', 'Recordatorio automático al cliente', 'Agenda por profesional', 'Si quieres más adelante, app propia'],
    dolores: [
      { t: 'El teléfono no para de sonar', d: 'Contestas con las manos ocupadas o pierdes la llamada, y ese cliente reserva en otro lado.' },
      { t: 'Clientes que no llegan', d: 'Una hora vacía es plata perdida. Muchas veces el cliente simplemente se olvidó.' },
      { t: 'La agenda vive en un cuaderno', d: 'Cuesta saber quién atiende a quién, qué horas quedan libres mañana y qué se hizo cada cliente la última vez.' }
    ],
    incluye: [
      { t: 'Reserva en línea', d: 'El cliente elige servicio, profesional y hora disponible. Funciona las 24 horas, también cuando estás cerrado.' },
      { t: 'Recordatorios automáticos', d: 'Le llega un aviso al cliente antes de su hora, con la opción de cancelar o cambiarla. Menos horas perdidas.' },
      { t: 'Agenda por profesional', d: 'Cada persona del equipo tiene sus horarios, servicios y días libres. Tú ves todo junto en el celular.' },
      { t: 'Servicios y precios', d: 'Corte, color, barba, manicure o lo que ofrezcas, con su duración y precio, para que la agenda calcule los tiempos sola.' },
      { t: 'Historial de cada cliente', d: 'Qué se hizo, qué color usaste y cuándo vino por última vez, para atenderlo mejor.' },
      { t: 'Página para que te encuentren', d: 'Fotos de tus trabajos, ubicación, horarios y botón a WhatsApp e Instagram, lista para Google Maps.' }
    ],
    faqs: [
      { q: '¿Por qué no usar una app de reservas que ya existe?', a: 'Puedes, pero normalmente pagas una mensualidad para siempre y la página es de la plataforma, no tuya. Aquí la agenda queda a tu nombre, con tu marca y sin comisiones por reserva.' },
      { q: '¿Se puede cobrar un abono al reservar?', a: 'Sí. Puedes pedir un abono con Webpay o Mercado Pago para asegurar la hora, sobre todo en servicios largos como color o tratamientos.' },
      { q: '¿Los recordatorios llegan por WhatsApp?', a: 'Por correo vienen incluidos. Por WhatsApp o SMS también se puede, aunque tiene un costo mensual pequeño según cuántos mensajes envíes. Lo vemos según tu caso.' },
      { q: '¿Y si después quiero una app propia?', a: 'Se puede construir sobre lo mismo. Partir con la web te permite probar y, si tus clientes la usan harto, damos el paso a la app.' }
    ],
    mensajeEjemplo: 'Ej: Tengo una barbería con 3 barberos y quiero que los clientes reserven solos y les llegue un recordatorio.'
  }
]

export const rubroPorSlug = (slug: string) => rubros.find(r => r.slug === slug)
