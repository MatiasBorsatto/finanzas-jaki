<script setup>
import { computed } from 'vue'
import { formatearMonto } from '../utils/formato.js'

const props = defineProps({
  montoObjetivo: { type: String, required: true },
  acumulado: { type: String, required: true }
})

// Aritmética exacta en centavos (BigInt); sin floats.
function aCentavos(texto) {
  const m = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(texto).trim())
  if (!m) return 0n
  const valor = BigInt(m[2]) * 100n + BigInt((m[3] || '').padEnd(2, '0') || '0')
  return m[1] ? -valor : valor
}
function deCentavos(c) {
  const neg = c < 0n
  const abs = neg ? -c : c
  return `${neg ? '-' : ''}${abs / 100n}.${String(abs % 100n).padStart(2, '0')}`
}

const objetivo = computed(() => aCentavos(props.montoObjetivo))
const juntado = computed(() => aCentavos(props.acumulado))

const porcentaje = computed(() => {
  if (objetivo.value === 0n) return '0'
  const centesimas = (juntado.value * 10000n) / objetivo.value
  const neg = centesimas < 0n
  const abs = neg ? -centesimas : centesimas
  const dec = String(abs % 100n).padStart(2, '0').replace(/0+$/, '')
  return `${neg ? '-' : ''}${abs / 100n}${dec ? `,${dec}` : ''}`
})
const ancho = computed(() => {
  if (objetivo.value === 0n || juntado.value <= 0n) return 0
  return juntado.value >= objetivo.value ? 100 : Number((juntado.value * 10000n) / objetivo.value) / 100
})
const restante = computed(() => formatearMonto(deCentavos(objetivo.value - juntado.value)))
const cumplida = computed(() => objetivo.value > 0n && juntado.value >= objetivo.value)
</script>

<template>
  <div class="meta">
    <div
      class="barra"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="ancho"
      :aria-valuetext="`${porcentaje} %`"
    >
      <div class="relleno" :style="{ width: `${ancho}%` }"></div>
    </div>
    <p class="detalle">
      <strong>{{ porcentaje }} %</strong>
      <span v-if="cumplida" class="etiqueta">Meta cumplida</span>
      <span class="montos">{{ formatearMonto(acumulado) }} de {{ formatearMonto(montoObjetivo) }}</span>
      <span class="montos">{{ restante }} restante</span>
    </p>
  </div>
</template>

<style scoped>
.barra { height: 12px; border-radius: 6px; background: var(--borde); overflow: hidden; }
.relleno { height: 100%; background: var(--primario); }
.detalle { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline; margin: 6px 0 0; font-size: 0.9rem; }
.montos { color: var(--texto-suave); }
.etiqueta { font-weight: 600; }
</style>
