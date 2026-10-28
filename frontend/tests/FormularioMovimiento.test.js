import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormularioMovimiento from '../src/components/FormularioMovimiento.vue'

const categorias = [{ id: '11111111-1111-1111-1111-111111111111', nombre: 'Comida' }]

describe('FormularioMovimiento', () => {
  it('no envía con monto vacío y muestra error', async () => {
    const wrapper = mount(FormularioMovimiento, { props: { categorias } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('guardar')).toBeUndefined()
    expect(wrapper.find('[role="alert"]').text()).toContain('monto')
  })

  it('envía el monto como string con 2 decimales', async () => {
    const wrapper = mount(FormularioMovimiento, { props: { categorias } })
    await wrapper.find('input[name="monto"]').setValue('1500,5')
    await wrapper.find('input[name="fecha"]').setValue('2026-10-27')
    await wrapper.find('form').trigger('submit')
    const datos = wrapper.emitted('guardar')[0][0]
    expect(datos.monto).toBe('1500.50')
    expect(datos.tipo).toBe('gasto')
    expect(datos.categoriaId).toBeNull()
  })
})
