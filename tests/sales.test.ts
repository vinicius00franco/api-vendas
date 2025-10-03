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
      .send({ name: 'Produto X', ean: '123', price: 10.0, description: 'd', categoryId: 1, brandId: null })
      .expect(201);

    const clientRes = await agent
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'José', document: '22233344455', email: 'jose@test.com',
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
});
