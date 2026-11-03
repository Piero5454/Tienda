// Número de WhatsApp para contacto (formato internacional, sin + ni espacios).
export const WHATSAPP = '56945798326'

export const whatsappUrl = (texto: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`
