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

  it('should list all products', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const res = await agent
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('uuid');
      expect(res.body.data[0]).not.toHaveProperty('id');
    }
  });

  it('should get product by id', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    // Create product
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${Date.now()}`, price: 500.00, categoryId: 1 })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    const res = await agent
      .get(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('uuid', productUuid);
    expect(res.body.data).not.toHaveProperty('id');
  });
});
