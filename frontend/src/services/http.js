const SIN_REFRESCO = ['/auth/refresh', '/auth/login']

async function pedir(metodo, url, cuerpo, reintento = false) {
  const opciones = { method: metodo, credentials: 'include', headers: {} }
  if (cuerpo !== undefined) {
    opciones.headers['Content-Type'] = 'application/json'
    opciones.body = JSON.stringify(cuerpo)
  }
  let respuesta = await fetch(`/api${url}`, opciones)
  // El access token dura poco: ante un 401 se refresca la sesión una vez y se reintenta.
  if (respuesta.status === 401 && !reintento && !SIN_REFRESCO.includes(url)) {
    let refrescada = false
    try {
      refrescada = (await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include', headers: {} })).ok
    } catch {
      refrescada = false
    }
    if (refrescada) respuesta = await fetch(`/api${url}`, opciones)
  }
  let datos = null
  if (respuesta.status !== 204) {
    try {
      datos = await respuesta.json()
    } catch {
      datos = null
    }
  }
  if (!respuesta.ok) {
    const error = new Error(datos?.error || datos?.mensaje || 'Ocurrió un error inesperado')
    error.status = respuesta.status
    error.mensaje = error.message
    throw error
  }
  return datos
}

export const http = {
  get: (url) => pedir('GET', url),
  post: (url, cuerpo) => pedir('POST', url, cuerpo ?? {}),
  patch: (url, cuerpo) => pedir('PATCH', url, cuerpo),
  put: (url, cuerpo) => pedir('PUT', url, cuerpo),
  delete: (url) => pedir('DELETE', url)
}
