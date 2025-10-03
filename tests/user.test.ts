import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase } from '../src/shared/database/data-source.js';

async function login(agent: any) {
  const res = await agent
    .post('/auth/login')
    .send({ email: 'admin2@email.com', password: '123456' })
    .expect(200);
  return res.body.data.token as string;
}

describe('Users', () => {
  it('should list all users', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const token = await login(agent);

    const res = await agent
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('uuid');
      expect(res.body.data[0]).not.toHaveProperty('id');
    }
  });

  it('should get user by id', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    // Get current user uuid from login response? Wait, login doesn't return user uuid.
    // Assume admin user uuid is known or create another user.

    // For now, since POST /users is allowed without auth, but GET requires auth.
    // Let's create a user first via POST, but POST is before auth, but in test we can call it.

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/users')
      .send({ name: `Test User ${suffix}`, email: `testuser${suffix}@test.com`, password: '123456' })
      .expect(201);

    const userUuid = createRes.body.data.uuid;

    const res = await agent
      .get(`/users/${userUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('uuid', userUuid);
    expect(res.body.data).not.toHaveProperty('id');
  });

  it('should update user', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/users')
      .send({ name: `Test User ${suffix}`, email: `testuser${suffix}@test.com`, password: '123456' })
      .expect(201);

    const userUuid = createRes.body.data.uuid;

    const updateRes = await agent
      .put(`/users/${userUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Updated User ${suffix}`, email: `updated${suffix}@test.com` })
      .expect(200);

    expect(updateRes.body.data).toHaveProperty('uuid', userUuid);
    expect(updateRes.body.data.name).toBe(`Updated User ${suffix}`);
    expect(updateRes.body.data.email).toBe(`updated${suffix}@test.com`);
  });

  it('should patch user', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/users')
      .send({ name: `Test User ${suffix}`, email: `testuser${suffix}@test.com`, password: '123456' })
      .expect(201);

    const userUuid = createRes.body.data.uuid;

    const patchRes = await agent
      .patch(`/users/${userUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Patched User ${suffix}` })
      .expect(200);

    expect(patchRes.body.data).toHaveProperty('uuid', userUuid);
    expect(patchRes.body.data.name).toBe(`Patched User ${suffix}`);
    expect(patchRes.body.data.email).toBe(`testuser${suffix}@test.com`); // unchanged
  });

  it('should delete user', async () => {
    const agent = await getTestAgent();
    const token = await login(agent);

    const suffix = String(Date.now());
    const createRes = await agent
      .post('/users')
      .send({ name: `Test User ${suffix}`, email: `testuser${suffix}@test.com`, password: '123456' })
      .expect(201);

    const userUuid = createRes.body.data.uuid;

    await agent
      .delete(`/users/${userUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Verify deleted
    const getRes = await agent
      .get(`/users/${userUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});