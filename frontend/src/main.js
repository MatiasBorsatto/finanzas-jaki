import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { crearRouter } from './router/index.js'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(crearRouter())
app.mount('#app')
