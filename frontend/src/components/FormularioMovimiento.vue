<script setup>
import { ref } from 'vue'
import { normalizarMonto } from '../utils/formato.js'

const props = defineProps({
  categorias: { type: Array, default: () => [] },
  movimiento: { type: Object, default: null }
})
const emit = defineEmits(['guardar', 'cancelar'])

const hoy = new Date().toISOString().slice(0, 10)
const tipo = ref(props.movimiento?.tipo ?? 'gasto')
const monto = ref(props.movimiento ? String(props.movimiento.monto).replace('.', ',') : '')
const fecha = ref(props.movimiento?.fecha ?? hoy)
const descripcion = ref(props.movimiento?.descripcion ?? '')
const categoriaId = ref(props.movimiento?.categoriaId ?? '')
const error = ref('')

function enviar() {
  const montoNormal = normalizarMonto(monto.value)
  if (!montoNormal) {
    error.value = 'Ingresá un monto válido mayor a 0 (hasta 2 decimales).'
    return
  }
  if (!fecha.value) {
    error.value = 'Ingresá una fecha.'
    return
  }
  error.value = ''
  emit('guardar', {
    tipo: tipo.value,
    monto: montoNormal,
    fecha: fecha.value,
    descripcion: descripcion.value.trim() || null,
    categoriaId: categoriaId.value || null
  })
}
</script>

<template>
  <form class="form-mov" novalidate @submit.prevent="enviar">
    <div v-if="error" class="error-form" role="alert">{{ error }}</div>
    <label>Tipo
      <select v-model="tipo" name="tipo">
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </select>
    </label>
    <label>Monto
      <input v-model="monto" name="monto" type="text" inputmode="decimal" placeholder="0,00" />
    </label>
    <label>Fecha
      <input v-model="fecha" name="fecha" type="date" />
    </label>
    <label>Categoría
      <select v-model="categoriaId" name="categoriaId">
        <option value="">Sin categoría</option>
        <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
      </select>
    </label>
    <label>Descripción
      <input v-model="descripcion" name="descripcion" type="text" maxlength="255" />
    </label>
    <div class="acciones">
      <button type="submit" class="primario">Guardar</button>
      <button v-if="movimiento" type="button" @click="emit('cancelar')">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>
.form-mov { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; align-items: end; margin-bottom: 20px; }
.form-mov label { display: block; font-size: 0.9rem; color: var(--texto-suave); min-width: 0; }
.form-mov input, .form-mov select {
  display: block; width: 100%; margin-top: 4px; padding: 10px;
  background: var(--superficie); color: var(--texto); border: 1px solid var(--borde); border-radius: 8px;
}
.error-form { grid-column: 1 / -1; padding: 10px; border-radius: 8px; background: var(--error-fondo); color: var(--error); }
.acciones { display: flex; gap: 8px; }
.acciones button { padding: 10px 16px; border-radius: 8px; border: 1px solid var(--borde); background: var(--superficie); color: var(--texto); cursor: pointer; }
.acciones .primario { background: var(--primario); color: var(--primario-texto); border-color: var(--primario); font-weight: 600; }
</style>
