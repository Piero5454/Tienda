// Estado compartido del cotizador: si está abierto y el último resumen,
// para que el formulario de contacto pueda usarlo.
export const useCotizador = () => {
  const abierto = useState('cotizador-abierto', () => false)
  const resumen = useState<{ tipo: string; texto: string } | null>('cotizador-resumen', () => null)
  const abrir = () => {
    abierto.value = true
    useNuxtApp().$evento?.('cotizador-abierto')
  }
  return { abierto, resumen, abrir }
}
