<script setup>
import { computed, onMounted, ref } from 'vue'
import { listarNotificaciones, marcarLeida } from '../services/notificaciones.js'
import { abrirPanel, cerrarPanel } from '../motion/movimiento.js'

const notificaciones = ref([])
const abierta = ref(false)
const error = ref('')
const boton = ref(null)

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

function cerrar() {
  abierta.value = false
  boton.value?.focus()
}

onMounted(cargar)
</script>

<template>
  <div class="campana-contenedor">
    <button
      ref="boton"
      class="campana"
      type="button"
      :aria-expanded="abierta"
      aria-controls="panel-notificaciones"
      :aria-label="`Notificaciones, ${noLeidas} sin leer`"
      @click="abierta = !abierta"
    >
      <span aria-hidden="true">🔔</span>
      <span v-if="noLeidas > 0" class="contador" data-testid="contador">{{ noLeidas }}</span>
    </button>
    <Transition :css="false" @enter="abrirPanel" @leave="cerrarPanel">
      <div v-if="abierta" id="panel-notificaciones" class="panel" role="region" aria-label="Notificaciones" @keydown.esc="cerrar">
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
        <RouterLink to="/perfil" class="ir-perfil" @click="abierta = false">Mi perfil</RouterLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.campana-contenedor { position: relative; }
.campana {
  position: relative; background: none; border: 0; cursor: pointer; width: 100%; padding: 10px 12px; min-height: 44px; font-size: 1.1rem; color: var(--texto);
}
.contador {
  position: absolute; top: 2px; right: 2px; min-width: 18px; padding: 0 5px; border-radius: 9px;
  background: var(--insignia); color: var(--insignia-texto); font-size: 0.75rem; line-height: 18px; text-align: center;
}
.panel {
  position: absolute; left: 0; top: 100%; width: 280px; max-height: 320px; overflow: auto; z-index: 20;
  background: var(--superficie); border: 1px solid var(--borde); border-radius: 8px; padding: 8px;
}
@media (max-width: 767px) { .panel { top: auto; bottom: calc(100% + 12px); width: min(280px, calc(100vw - 16px)); } }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; flex-direction: column; gap: 4px; padding: 8px; border-bottom: 1px solid var(--borde); }
li.leida { color: var(--texto-suave); }
.vacio, .error { margin: 0; padding: 8px; }
.ir-perfil {
  display: flex; align-items: center; min-height: 44px; margin-top: 4px; padding: 8px;
  border-top: 1px solid var(--borde); color: var(--texto); text-decoration: none;
}
</style>
