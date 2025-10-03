import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase } from '../src/shared/database/data-source.js';

async function login(agent: any) {
  const res = await agent
    .post('/auth/login')
    .send({ email: 'admin2@email.com', password: '123456' })
    .expect(200);
  return res.body.data.token as string;
}

describe('Categories', () => {
  it('should create category and return uuid without id', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const token = await login(agent);

    const res = await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Periféricos', description: 'Itens de computador' })
      .expect(201);

    expect(res.body.data).toHaveProperty('uuid');
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should list all categories', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const res = await agent
      .get('/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('uuid');
      expect(res.body.data[0]).not.toHaveProperty('id');
    }
  });

  it('should get category by id', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // First create a category with unique name to avoid conflicts
    const suffix = String(Date.now());
    const createRes = await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${suffix}`, description: 'Test Desc' })
      .expect(201);

    const categoryUuid = createRes.body.data.uuid;

    const res = await agent
      .get(`/categories/${categoryUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('uuid', categoryUuid);
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should update category', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${suffix}`, description: 'Test Desc' })
      .expect(201);

    const categoryUuid = createRes.body.data.uuid;

    const updateRes = await agent
      .put(`/categories/${categoryUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Updated Category ${suffix}`, description: 'Updated Desc' })
      .expect(200);

    expect(updateRes.body.data).toHaveProperty('uuid', categoryUuid);
    expect(updateRes.body.data.name).toBe(`Updated Category ${suffix}`);
    expect(updateRes.body.data.description).toBe('Updated Desc');
  });

  it('should patch category', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${suffix}`, description: 'Test Desc' })
      .expect(201);

    const categoryUuid = createRes.body.data.uuid;

    const patchRes = await agent
      .patch(`/categories/${categoryUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Patched Desc' })
      .expect(200);

    expect(patchRes.body.data).toHaveProperty('uuid', categoryUuid);
    expect(patchRes.body.data.name).toBe(`Test Category ${suffix}`); // unchanged
    expect(patchRes.body.data.description).toBe('Patched Desc');
  });

  it('should delete category', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Category ${suffix}`, description: 'Test Desc' })
      .expect(201);

    const categoryUuid = createRes.body.data.uuid;

    await agent
      .delete(`/categories/${categoryUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Verify deleted
    const getRes = await agent
      .get(`/categories/${categoryUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should return 400 for duplicate category name', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const name = `Duplicate Category ${suffix}`;

    // Create first category
    await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name, description: 'First desc' })
      .expect(201);

    // Try to create second with same name
    const res = await agent
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name, description: 'Second desc' })
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Já existe uma categoria com este nome');
  });
});
