<script setup>
import { computed } from 'vue'
import { formatearMonto } from '../utils/formato.js'

const props = defineProps({
  montoLimite: { type: String, required: true },
  consumido: { type: String, required: true },
  alerta: { type: String, default: null }
})

// Montos como centavos enteros (BigInt): sin floats.
function centavos(monto) {
  const [e, d = ''] = String(monto).split('.')
  return BigInt(e || '0') * 100n + BigInt(d.padEnd(2, '0').slice(0, 2) || '0')
}

const porcentaje = computed(() => {
  const limite = centavos(props.montoLimite)
  if (limite === 0n) return 0
  return Number((centavos(props.consumido) * 100n) / limite)
})
const ancho = computed(() => Math.min(porcentaje.value, 100))
const estado = computed(() => (props.alerta === '100' ? 'error' : props.alerta === '80' ? 'advertencia' : ''))
const etiqueta = computed(() =>
  props.alerta === '100' ? 'Superado' : props.alerta === '80' ? 'Cerca del límite' : 'En rango'
)
</script>

<template>
  <div class="presupuesto">
    <div
      class="barra"
      :class="estado"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="ancho"
      :aria-valuetext="`${porcentaje}% - ${etiqueta}`"
    >
      <div class="relleno" :style="{ width: `${ancho}%` }"></div>
    </div>
    <p class="detalle">
      <strong>{{ porcentaje }}%</strong>
      <span class="etiqueta" :class="estado">{{ etiqueta }}</span>
      <span class="montos">{{ formatearMonto(consumido) }} de {{ formatearMonto(montoLimite) }}</span>
    </p>
  </div>
</template>

<style scoped>
.barra { height: 12px; border-radius: 6px; background: var(--borde); overflow: hidden; }
.relleno { height: 100%; background: var(--primario); }
.barra.advertencia .relleno { background: #b26a00; }
.barra.error .relleno { background: var(--error); }
.detalle { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline; margin: 6px 0 0; font-size: 0.9rem; }
.montos { color: var(--texto-suave); }
.etiqueta { font-weight: 600; }
.etiqueta.advertencia { color: #b26a00; }
.etiqueta.error { color: var(--error); }
@media (prefers-color-scheme: dark) {
  .barra.advertencia .relleno { background: #e0a030; }
  .etiqueta.advertencia { color: #e0a030; }
}
</style>
