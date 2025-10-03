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

    const res = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Maria Teste',
        document: '11122233344',
        email: 'maria@test.com',
        phone: '+55 11 99999-9999',
        address: { street: 'Rua A', number: '10', city: 'SP', state: 'SP', postalCode: '00000-000', country: 'BR' }
      })
      .expect(201);

    expect(res.body.data).toHaveProperty('uuid');
    expect(res.body.data).not.toHaveProperty('id');
  });
});
