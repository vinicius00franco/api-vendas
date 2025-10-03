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
  it('should create a product with brand and return uuid', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const token = await login(agent);

    // Ensure there's a category id=1 already created in seed; otherwise create one
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Informática Test', description: 'desc' })
      .expect(201);

    // Create a brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    const res = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Notebook Test', ean: '123', price: 1000.00, description: 'd', categoryId: 1, brandUuid: brandRes.body.data.uuid })
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

    // Create brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    // Create product
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${Date.now()}`, price: 500.00, categoryId: 1, brandUuid: brandRes.body.data.uuid })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    const res = await agent
      .get(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('uuid', productUuid);
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should update product', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    // Create brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    // Create product
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${suffix}`, price: 500.00, categoryId: 1, brandUuid: brandRes.body.data.uuid })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    const updateRes = await agent
      .put(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Updated Product ${suffix}`, description: 'Updated desc' })
      .expect(200);

    expect(updateRes.body.data).toHaveProperty('uuid', productUuid);
    expect(updateRes.body.data.name).toBe(`Updated Product ${suffix}`);
    expect(updateRes.body.data.description).toBe('Updated desc');
  });

  it('should patch product', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    // Create brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    // Create product
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${suffix}`, price: 500.00, categoryId: 1, brandUuid: brandRes.body.data.uuid })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    const patchRes = await agent
      .patch(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Patched desc' })
      .expect(200);

    expect(patchRes.body.data).toHaveProperty('uuid', productUuid);
    expect(patchRes.body.data.name).toBe(`Test Product ${suffix}`); // unchanged
    expect(patchRes.body.data.description).toBe('Patched desc');
  });

  it('should delete product', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    // Create brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    // Create product
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${suffix}`, price: 500.00, categoryId: 1, brandUuid: brandRes.body.data.uuid })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    await agent
      .delete(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Verify deleted
    const getRes = await agent
      .get(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should patch product', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    // Create brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    // Create product
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${suffix}`, price: 500.00, categoryId: 1, brandUuid: brandRes.body.data.uuid })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    const patchRes = await agent
      .patch(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Patched desc' })
      .expect(200);

    expect(patchRes.body.data).toHaveProperty('uuid', productUuid);
    expect(patchRes.body.data.name).toBe(`Test Product ${suffix}`); // unchanged
    expect(patchRes.body.data.description).toBe('Patched desc');
  });

  it('should delete product', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    // Create brand
    const brandRes = await agent
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Brand ${Date.now()}` })
      .expect(201);

    // Create product
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${suffix}`, price: 500.00, categoryId: 1, brandUuid: brandRes.body.data.uuid })
      .expect(201);

    const productUuid = createRes.body.data.uuid;

    await agent
      .delete(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Verify deleted
    const getRes = await agent
      .get(`/products/${productUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should return 400 for product without brand', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Create category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${Date.now()}`, description: 'desc' })
      .expect(201);

    const res = await agent
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Product ${Date.now()}`, price: 500.00, categoryId: 1 }) // no brandId
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Marca do produto é obrigatória');
  });
});
