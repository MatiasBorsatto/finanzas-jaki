// Formato de dinero argentino a partir de un string decimal ("1500.50"); sin floats.
export function formatearMonto(monto) {
  const m = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(monto).trim())
  if (!m) return String(monto)
  const enteros = m[2].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const decimales = (m[3] || '').padEnd(2, '0')
  return `${m[1]}$ ${enteros},${decimales}`
}

// Acepta "1500", "1500.5" o "1.500,50"/"1500,5"; devuelve "1500.50" o null si es inválido.
export function normalizarMonto(texto) {
  let t = String(texto ?? '').trim()
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.')
  const m = /^(\d+)(?:\.(\d{1,2}))?$/.exec(t)
  if (!m) return null
  const valor = `${m[1]}.${(m[2] || '').padEnd(2, '0')}`
  return /^0+\.00$/.test(valor) ? null : valor
}
