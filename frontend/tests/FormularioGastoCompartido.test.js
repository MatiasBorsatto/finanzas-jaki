import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormularioGastoCompartido from '../src/components/FormularioGastoCompartido.vue'

const miembros = [
  { usuarioId: 'u1', nombre: 'Ana' },
  { usuarioId: 'u2', nombre: 'Beto' },
  { usuarioId: 'u3', nombre: 'Cami' }
]

async function montar() {
  const w = mount(FormularioGastoCompartido, { props: { miembros, usuarioId: 'u1', categorias: [] } })
  await w.find('input[name="monto"]').setValue('100')
  await w.find('input[name="fecha"]').setValue('2026-10-27')
  return w
}

describe('FormularioGastoCompartido', () => {
  it('reparte en partes iguales por defecto sin perder centavos', async () => {
    const w = await montar()
    const montos = w.findAll('[data-reparto]').map((e) => e.text())
    expect(montos).toEqual(['$ 33,34', '$ 33,33', '$ 33,33'])
    await w.find('form').trigger('submit')
    const datos = w.emitted('guardar')[0][0]
    expect(datos.monto).toBe('100.00')
    expect(datos.pagadorId).toBe('u1')
  })

  it('con reparto personalizado de suma distinta deshabilita el envío', async () => {
    const w = await montar()
    await w.find('select[name="modo"]').setValue('personalizado')
    await w.find('input[name="monto-u1"]').setValue('50')
    await w.find('input[name="monto-u2"]').setValue('30')
    await w.find('input[name="monto-u3"]').setValue('10')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('guardar')).toBeUndefined()
  })

  it('con reparto personalizado de suma exacta envía los participantes', async () => {
    const w = await montar()
    await w.find('select[name="modo"]').setValue('personalizado')
    await w.find('input[name="monto-u1"]').setValue('50')
    await w.find('input[name="monto-u2"]').setValue('30,5')
    await w.find('input[name="monto-u3"]').setValue('19,50')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('guardar')[0][0].participantes).toEqual([
      { usuarioId: 'u1', monto: '50.00' },
      { usuarioId: 'u2', monto: '30.50' },
      { usuarioId: 'u3', monto: '19.50' }
    ])
  })
})
