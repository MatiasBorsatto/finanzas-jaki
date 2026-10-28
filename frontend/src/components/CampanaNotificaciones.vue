<script setup>
import { computed, onMounted, ref } from 'vue'
import { listarNotificaciones, marcarLeida } from '../services/notificaciones.js'

const notificaciones = ref([])
const abierta = ref(false)
const error = ref('')

const noLeidas = computed(() => notificaciones.value.filter((n) => !n.leida).length)

async function cargar() {
  try {
    notificaciones.value = await listarNotificaciones()
  } catch {
    error.value = 'No pudimos cargar las notificaciones.'
  }
}

async function marcar(n) {
  try {
    await marcarLeida(n.id)
    n.leida = true
  } catch {
    error.value = 'No pudimos marcar la notificación como leída.'
  }
}

onMounted(cargar)
</script>

<template>
  <div class="campana-contenedor">
    <button
      class="campana"
      type="button"
      :aria-expanded="abierta"
      :aria-label="`Notificaciones, ${noLeidas} sin leer`"
      @click="abierta = !abierta"
    >
      <span aria-hidden="true">🔔</span>
      <span v-if="noLeidas > 0" class="contador" data-testid="contador">{{ noLeidas }}</span>
    </button>
    <div v-if="abierta" class="panel">
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="notificaciones.length === 0" class="vacio">No tenés notificaciones.</p>
      <ul v-else>
        <li v-for="n in notificaciones" :key="n.id" :class="{ leida: n.leida }">
          <span>{{ n.mensaje }}</span>
          <button v-if="!n.leida" type="button" :data-testid="`marcar-${n.id}`" @click="marcar(n)">
            Marcar como leída
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.campana-contenedor { position: relative; }
.campana {
  position: relative; background: none; border: 0; cursor: pointer; padding: 10px 12px; font-size: 1.1rem;
}
.contador {
  position: absolute; top: 2px; right: 2px; min-width: 18px; padding: 0 5px; border-radius: 9px;
  background: var(--error, #c0392b); color: #fff; font-size: 0.75rem; line-height: 18px; text-align: center;
}
.panel {
  position: absolute; left: 0; top: 100%; width: 280px; max-height: 320px; overflow: auto; z-index: 20;
  background: var(--superficie); border: 1px solid var(--borde); border-radius: 8px; padding: 8px;
}
@media (max-width: 767px) { .panel { top: auto; bottom: 100%; } }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; flex-direction: column; gap: 4px; padding: 8px; border-bottom: 1px solid var(--borde); }
li.leida { color: var(--texto-suave); }
.vacio, .error { margin: 0; padding: 8px; }
</style>
