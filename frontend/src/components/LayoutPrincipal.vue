<script setup>
import { useRouter } from 'vue-router'
import { useSesion } from '../stores/sesion.js'
import CampanaNotificaciones from './CampanaNotificaciones.vue'

const router = useRouter()
const sesion = useSesion()
const enlaces = [
  { to: '/movimientos', texto: 'Movimientos' },
  { to: '/presupuestos', texto: 'Presupuestos' },
  { to: '/tarjetas', texto: 'Tarjetas' },
  { to: '/metas', texto: 'Metas' },
  { to: '/grupos', texto: 'Grupos' },
  { to: '/estadisticas', texto: 'Estadísticas' }
]

async function salir() {
  await sesion.cerrarSesion()
  await router.push('/login')
}
</script>

<template>
  <div class="layout">
    <nav class="navegacion" aria-label="Principal">
      <strong class="marca">Finanzas Jaki</strong>
      <CampanaNotificaciones />
      <RouterLink v-for="e in enlaces" :key="e.to" :to="e.to" class="enlace">{{ e.texto }}</RouterLink>
      <RouterLink to="/perfil" class="enlace solo-escritorio">Perfil</RouterLink>
      <button class="enlace salir" type="button" @click="salir">Salir</button>
    </nav>
    <main class="contenido"><RouterView /></main>
  </div>
</template>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.navegacion {
  display: flex; flex-direction: column; gap: 4px; width: 220px; padding: 16px;
  background: var(--superficie); border-right: 1px solid var(--borde);
}
.marca { margin-bottom: 16px; }
.enlace {
  padding: 10px 12px; border-radius: 8px; color: var(--texto); text-decoration: none;
  background: none; border: 0; text-align: left; cursor: pointer;
}
.enlace.router-link-active { background: var(--primario); color: var(--primario-texto); }
.solo-escritorio { margin-top: auto; }
.salir { margin-top: 0; color: var(--texto-suave); font: inherit; }
.contenido { flex: 1; min-width: 0; padding: 24px; }

@media (max-width: 767px) {
  .layout { flex-direction: column; }
  .marca { display: none; }
  .navegacion {
    position: fixed; bottom: 0; left: 0; right: 0; width: 100%;
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: stretch;
    gap: 2px; padding: 6px; border-right: 0; border-top: 1px solid var(--borde); z-index: 10;
  }
  .enlace {
    display: flex; align-items: center; justify-content: center; min-height: 44px;
    padding: 6px 4px; font-size: 0.8rem; text-align: center; overflow-wrap: anywhere;
  }
  .solo-escritorio { display: none; }
  .contenido { padding: 16px 16px 120px; }
}
</style>
