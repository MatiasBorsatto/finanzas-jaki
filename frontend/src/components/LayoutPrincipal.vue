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
  { to: '/grupos', texto: 'Grupos' }
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
.salir { margin-top: auto; color: var(--texto-suave); }
.contenido { flex: 1; min-width: 0; padding: 24px; }

@media (max-width: 767px) {
  .layout { flex-direction: column; }
  .marca { display: none; }
  .navegacion {
    position: fixed; bottom: 0; left: 0; right: 0; width: 100%; flex-direction: row;
    justify-content: space-around; padding: 6px; border-right: 0; border-top: 1px solid var(--borde); z-index: 10;
  }
  .enlace { flex: 1; text-align: center; padding: 10px 4px; font-size: 0.85rem; }
  .salir { margin-top: 0; }
  .contenido { padding: 16px 16px 80px; }
}
</style>
