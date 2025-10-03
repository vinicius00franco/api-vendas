import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase } from '../src/shared/database/data-source.js';

async function login(agent: any) {
  const res = await agent
    .post('/auth/login')
    .send({ email: 'admin2@email.com', password: '123456' })
    .expect(200);
  return res.body.data.token as string;
}

describe('Products', () => {
  it('should create a product with optional brand and return uuid', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const token = await login(agent);

    // Ensure there's a category id=1 already created in seed; otherwise create one
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Informática Test', description: 'desc' })
      .expect(201);

    const res = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Notebook Test', ean: '123', price: 1000.00, description: 'd', categoryId: 1, brandId: null })
      .expect(201);

    expect(res.body.data).toHaveProperty('uuid');
    expect(res.body.data).not.toHaveProperty('id');
  });
});
