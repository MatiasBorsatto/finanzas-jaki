const request = require('supertest');
const { createApp } = require('../src/app');
const { sequelize } = require('../src/db/sequelize');
const { Usuario, Grupo, MiembroGrupo, Categoria, Movimiento, ParticipacionGasto, Presupuesto } = require('../src/db/models');

const app = createApp();
const sufijo = Date.now();
const correos = ['a', 'b'].map((x) => `presc-${x}-${sufijo}@example.com`);
const password = 'clave-segura-1';
let agentA;
let agentB;
let ids;
const grupos = [];
let catComida;

async function sesion(correo, nombre) {
  const agent = request.agent(app);
  await agent.post('/api/auth/registro').send({ nombre, email: correo, password });
  await agent.post('/api/auth/login').send({ email: correo, password });
  return agent;
}

beforeAll(async () => {
  agentA = await sesion(correos[0], 'Ana');
  agentB = await sesion(correos[1], 'Bruno');
  const us = await Usuario.findAll({ where: { email: correos } });
  const porEmail = Object.fromEntries(us.map((u) => [u.email, u.id]));
  ids = { a: porEmail[correos[0]], b: porEmail[correos[1]] };
  catComida = (await agentA.post('/api/categorias').send({ nombre: 'Comida' })).body.id;
  for (const n of [1, 2]) {
    const g = await Grupo.create({ nombre: `G${n}`, codigo: `P${n}${String(sufijo).slice(-6)}`, creadoPor: ids.a });
    grupos.push(g.id);
    await MiembroGrupo.bulkCreate([
      { grupoId: g.id, usuarioId: ids.a, rol: 'admin' },
      { grupoId: g.id, usuarioId: ids.b, rol: 'miembro' },
    ]);
  }
  // Personal 100.00; compartidos de 50.00 y 30.00 en dos grupos (mitad c/u); uno fuera de mes.
  await agentA.post('/api/movimientos').send({ tipo: 'gasto', monto: '100.00', fecha: '2026-10-02', categoriaId: catComida });
  await compartido(grupos[0], { monto: '50.00', fecha: '2026-10-03' });
  await compartido(grupos[1], { monto: '30.00', fecha: '2026-10-04' });
  await compartido(grupos[0], { monto: '40.00', fecha: '2026-11-01' });
});

afterAll(async () => {
  const usuarios = Object.values(ids);
  const movs = await Movimiento.findAll({ where: { usuarioId: usuarios } });
  await ParticipacionGasto.destroy({ where: { movimientoId: movs.map((m) => m.id) } });
  await Movimiento.destroy({ where: { usuarioId: usuarios } });
  await Presupuesto.destroy({ where: { usuarioId: usuarios } });
  await MiembroGrupo.destroy({ where: { grupoId: grupos } });
  await Grupo.destroy({ where: { id: grupos } });
  await Categoria.destroy({ where: { usuarioId: usuarios } });
  await Usuario.destroy({ where: { email: correos } });
  await sequelize.close();
});

const compartido = (grupoId, datos) =>
  agentA.post(`/api/grupos/${grupoId}/gastos`).send({ pagadorId: ids.a, categoriaId: catComida, ...datos });
const poner = (regla) =>
  agentA.put('/api/presupuestos').send({ categoriaId: catComida, mes: '2026-10', montoLimite: '1000.00', regla });
const estado = async () =>
  (await agentA.get('/api/presupuestos/estado?mes=2026-10')).body.find((e) => e.categoriaId === catComida);

test('con_compartidos suma su parte de dos grupos distintos', async () => {
  const put = await poner('con_compartidos');
  expect(put.status).toBe(200);
  expect(put.body.regla).toBe('con_compartidos');
  const e = await estado();
  // 100.00 personal + 25.00 (grupo 1) + 15.00 (grupo 2); el mes siguiente no cuenta.
  expect(e.consumido).toBe('140.00');
  expect(e.restante).toBe('860.00');
});

test('solo_personal no incluye compartidos', async () => {
  await poner('solo_personal');
  expect((await estado()).consumido).toBe('100.00');
});

test('no cuenta dos veces el gasto compartido que creó el usuario', async () => {
  await poner('con_compartidos');
  // Ana creó y pagó los gastos: solo cuenta su participación, no el monto total.
  expect((await estado()).consumido).toBe('140.00');
});

test('otro participante no cuenta lo que no es suyo', async () => {
  const catB = (await agentB.post('/api/categorias').send({ nombre: 'Propia' })).body.id;
  await agentB.put('/api/presupuestos').send({ categoriaId: catB, mes: '2026-10', montoLimite: '10.00', regla: 'con_compartidos' });
  const e = (await agentB.get('/api/presupuestos/estado?mes=2026-10')).body.find((x) => x.categoriaId === catB);
  expect(e.consumido).toBe('0.00');
});
