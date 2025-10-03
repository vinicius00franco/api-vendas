import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase } from '../src/shared/database/data-source.js';

async function login(agent: any) {
  const res = await agent
    .post('/auth/login')
    .send({ email: 'admin2@email.com', password: '123456' })
    .expect(200);
  return res.body.data.token as string;
}

describe('Sales', () => {
  it('should create a sale and return uuid without id', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const token = await login(agent);

    // Prepare product and client
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'CAT Test', description: 'desc' });

    const productRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Produto X ${Date.now()}`, ean: String(Date.now()), price: 10.0, description: 'd', categoryId: 1, brandId: null })
      .expect(201);

    const suffix = String(Date.now());
    const clientRes = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `José ${suffix}`, document: `222333444${suffix.slice(-2)}`, email: `jose${suffix}@test.com`,
        address: { street: 'Rua B', number: '20', city: 'SP', state: 'SP', postalCode: '11111-111', country: 'BR' }
      })
      .expect(201);

    const res = await agent
      .post('/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 10.0, discount: 1.0, productId: 1, clientId: 1 })
      .expect(201);

    expect(res.body.data).toHaveProperty('uuid');
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should list all sales', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const res = await agent
      .get('/sales')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('uuid');
      expect(res.body.data[0]).not.toHaveProperty('id');
    }
  });

  it('should get sale by id', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Prepare data
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Cat', description: 'desc' });

    await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Prod', price: 100.0, categoryId: 1 });

    await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Client', document: '33344455566', email: 'client@test.com',
        address: { street: 'Rua C', number: '30', city: 'BH', state: 'MG', postalCode: '22222-222', country: 'BR' }
      });

    // Create sale
    const createRes = await agent
      .post('/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 100.0, productId: 1, clientId: 1 })
      .expect(201);

    const saleUuid = createRes.body.data.uuid;

    const res = await agent
      .get(`/sales/${saleUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('uuid', saleUuid);
    expect(res.body.data).not.toHaveProperty('id');
  });
});
