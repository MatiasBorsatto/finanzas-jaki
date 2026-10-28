async function pedir(metodo, url, cuerpo) {
  const opciones = { method: metodo, credentials: 'include', headers: {} }
  if (cuerpo !== undefined) {
    opciones.headers['Content-Type'] = 'application/json'
    opciones.body = JSON.stringify(cuerpo)
  }
  const respuesta = await fetch(`/api${url}`, opciones)
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
  delete: (url) => pedir('DELETE', url)
}
