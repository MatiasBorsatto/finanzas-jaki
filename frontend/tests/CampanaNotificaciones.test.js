import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

vi.mock('../src/services/notificaciones.js', () => ({
  listarNotificaciones: vi.fn().mockResolvedValue([
    { id: '1', mensaje: 'Llegaste al 80% del presupuesto de Comida', leida: false },
    { id: '2', mensaje: 'Superaste el presupuesto de Ocio', leida: false },
    { id: '3', mensaje: 'Vieja', leida: true }
  ]),
  marcarLeida: vi.fn().mockResolvedValue({ id: '1', leida: true })
}))

import CampanaNotificaciones from '../src/components/CampanaNotificaciones.vue'
import { marcarLeida } from '../src/services/notificaciones.js'

describe('CampanaNotificaciones', () => {
  it('muestra el contador de no leídas', async () => {
    const wrapper = mount(CampanaNotificaciones)
    await flushPromises()
    expect(wrapper.find('[data-testid="contador"]').text()).toBe('2')
  })

  it('al marcar una como leída baja el contador', async () => {
    const wrapper = mount(CampanaNotificaciones)
    await flushPromises()
    await wrapper.find('button.campana').trigger('click')
    expect(wrapper.text()).toContain('Superaste el presupuesto de Ocio')
    await wrapper.find('[data-testid="marcar-1"]').trigger('click')
    await flushPromises()
    expect(marcarLeida).toHaveBeenCalledWith('1')
    expect(wrapper.find('[data-testid="contador"]').text()).toBe('1')
  })
})
