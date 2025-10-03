import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase } from '../src/shared/database/data-source.js';

async function login(agent: any) {
  const res = await agent
    .post('/auth/login')
    .send({ email: 'admin2@email.com', password: '123456' })
    .expect(200);
  return res.body.data.token as string;
}

describe('Clients', () => {
  it('should create a client and return uuid without id', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const res = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Maria Teste ${suffix}`,
        document: `111222333${suffix.slice(-2)}`,
        email: `maria${suffix}@test.com`,
        phone: '+55 11 99999-9999',
        address: { street: 'Rua A', number: '10', city: 'SP', state: 'SP', postalCode: '00000-000', country: 'BR' }
      })
      .expect(201);

    expect(res.body.data).toHaveProperty('uuid');
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should list all clients', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const res = await agent
      .get('/clients')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('uuid');
      expect(res.body.data[0]).not.toHaveProperty('id');
    }
  });

  it('should get client by id', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create client
    const createRes = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João Silva',
        document: '22233344455',
        email: 'joao@test.com',
        phone: '+55 11 88888-8888',
        address: { street: 'Rua B', number: '20', city: 'RJ', state: 'RJ', postalCode: '11111-111', country: 'BR' }
      })
      .expect(201);

    const clientUuid = createRes.body.data.uuid;

    const res = await agent
      .get(`/clients/${clientUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('uuid', clientUuid);
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should update client', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create client
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `João Silva ${suffix}`,
        document: `222333444${suffix.slice(-2)}`,
        email: `joao${suffix}@test.com`,
        phone: '+55 11 88888-8888',
        address: { street: 'Rua B', number: '20', city: 'RJ', state: 'RJ', postalCode: '11111-111', country: 'BR' }
      })
      .expect(201);

    const clientUuid = createRes.body.data.uuid;

    const updateRes = await agent
      .put(`/clients/${clientUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `João Silva Updated ${suffix}`,
        email: `updated${suffix}@test.com`
      })
      .expect(200);

    expect(updateRes.body.data).toHaveProperty('uuid', clientUuid);
    expect(updateRes.body.data.name).toBe(`João Silva Updated ${suffix}`);
    expect(updateRes.body.data.email).toBe(`updated${suffix}@test.com`);
  });

  it('should patch client', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create client
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `João Silva ${suffix}`,
        document: `222333444${suffix.slice(-2)}`,
        email: `joao${suffix}@test.com`,
        phone: '+55 11 88888-8888',
        address: { street: 'Rua B', number: '20', city: 'RJ', state: 'RJ', postalCode: '11111-111', country: 'BR' }
      })
      .expect(201);

    const clientUuid = createRes.body.data.uuid;

    const patchRes = await agent
      .patch(`/clients/${clientUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '+55 11 77777-7777' })
      .expect(200);

    expect(patchRes.body.data).toHaveProperty('uuid', clientUuid);
    expect(patchRes.body.data.name).toBe(`João Silva ${suffix}`); // unchanged
    expect(patchRes.body.data.phone).toBe('+55 11 77777-7777');
  });

  it('should delete client', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create client
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `João Silva ${suffix}`,
        document: `222333444${suffix.slice(-2)}`,
        email: `joao${suffix}@test.com`,
        phone: '+55 11 88888-8888',
        address: { street: 'Rua B', number: '20', city: 'RJ', state: 'RJ', postalCode: '11111-111', country: 'BR' }
      })
      .expect(201);

    const clientUuid = createRes.body.data.uuid;

    await agent
      .delete(`/clients/${clientUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Verify deleted
    const getRes = await agent
      .get(`/clients/${clientUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
