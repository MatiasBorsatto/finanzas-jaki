<script setup>
import { computed } from 'vue'
import { formatearMonto } from '../utils/formato.js'

const props = defineProps({
  montoLimite: { type: String, required: true },
  consumido: { type: String, required: true },
  restante: { type: String, required: true },
  porcentaje: { type: Number, required: true },
  alerta: { type: String, default: null }
})

const ancho = computed(() => Math.max(0, Math.min(props.porcentaje, 100)))
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
      :aria-valuetext="`${props.porcentaje}% - ${etiqueta}`"
    >
      <div class="relleno" :style="{ width: `${ancho}%` }"></div>
    </div>
    <p class="detalle">
      <strong>{{ porcentaje }}%</strong>
      <span class="etiqueta" :class="estado">{{ etiqueta }}</span>
      <span class="montos">{{ formatearMonto(consumido) }} de {{ formatearMonto(montoLimite) }}</span>
      <span class="montos">Restante: {{ formatearMonto(restante) }}</span>
    </p>
  </div>
</template>

<style scoped>
.barra { height: 12px; border-radius: 6px; background: var(--borde); overflow: hidden; }
.relleno { height: 100%; background: var(--primario); }
.barra.advertencia .relleno { background: var(--advertencia); }
.barra.error .relleno { background: var(--error); }
.detalle { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline; margin: 6px 0 0; font-size: 0.9rem; }
.montos { color: var(--texto-suave); }
.etiqueta { font-weight: 600; }
.etiqueta.advertencia { color: var(--advertencia); }
.etiqueta.error { color: var(--error); }
</style>
