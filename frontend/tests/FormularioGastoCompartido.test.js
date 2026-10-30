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

  it('incluye categoriaId solo en el participante con categoría elegida', async () => {
    const base = { id: 'c-base', nombre: 'Comida', usuarioId: null }
    const propia = { id: 'c-propia', nombre: 'Mía', usuarioId: 'u1' }
    const w = mount(FormularioGastoCompartido, { props: { miembros, usuarioId: 'u1', categorias: [base, propia] } })
    await w.find('input[name="monto"]').setValue('90')
    await w.find('select[name="categoria-u1"]').setValue('c-propia')
    await w.find('select[name="categoria-u2"]').setValue('c-base')
    // la categoría propia no se ofrece a otro participante
    expect(w.find('select[name="categoria-u2"]').findAll('option').map((o) => o.text())).not.toContain('Mía')
    await w.find('form').trigger('submit')
    const ps = w.emitted('guardar')[0][0].participantes
    expect(ps[0]).toEqual({ usuarioId: 'u1', monto: '30.00', categoriaId: 'c-propia' })
    expect(ps[1]).toEqual({ usuarioId: 'u2', monto: '30.00', categoriaId: 'c-base' })
    expect(ps[2]).toEqual({ usuarioId: 'u3', monto: '30.00' })
  })

  it('el selector de categoría muestra "Heredar del gasto" por defecto', () => {
    const w = mount(FormularioGastoCompartido, { props: { miembros, usuarioId: 'u1', categorias: [] } })
    const sel = w.find('select[name="categoria-u2"]')
    expect(sel.element.value).toBe('')
    expect(sel.element.selectedOptions[0].textContent).toBe('Heredar del gasto')
  })
})
