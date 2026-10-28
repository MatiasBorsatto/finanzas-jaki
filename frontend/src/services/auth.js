import { http } from './http.js'

export const registrar = (nombre, email, password) =>
  http.post('/auth/registro', { nombre, email, password })
export const login = (email, password) => http.post('/auth/login', { email, password })
export const logout = () => http.post('/auth/logout')
export const obtenerPerfil = () => http.get('/usuario/perfil')
