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
});