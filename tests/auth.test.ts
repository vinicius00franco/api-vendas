import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase, AppDataSource } from '../src/shared/database/data-source.js';

describe('Auth', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  it('should login admin and return token', async () => {
    const agent = await getTestAgent();
    const res = await agent
      .post('/auth/login')
      .send({ email: 'admin2@email.com', password: '123456' })
      .expect(200);

    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('uuid');
  });

  it('should return 401 for access without token', async () => {
    const agent = await getTestAgent();
    const res = await agent
      .get('/users')
      .expect(401);

    expect(res.body).toHaveProperty('message');
  });

  it('should return 401 for invalid token', async () => {
    const agent = await getTestAgent();
    const res = await agent
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);

    expect(res.body).toHaveProperty('message');
  });

  it('should login non-admin user', async () => {
    const agent = await getTestAgent();
    // First create a non-admin user
    const suffix = String(Date.now());
    await agent
      .post('/users')
      .send({ name: 'Non Admin', email: `nonadmin${suffix}@test.com`, password: '123456' })
      .expect(201);

    const res = await agent
      .post('/auth/login')
      .send({ email: `nonadmin${suffix}@test.com`, password: '123456' })
      .expect(200);

    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.isAdmin).toBe(false);
  });
});
