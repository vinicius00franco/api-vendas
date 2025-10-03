import { getTestAgent } from './utils/testApp.js';
import { initializeDatabase, AppDataSource } from '../src/shared/database/data-source.js';

describe('Auth', () => {
  it('should login admin and return token', async () => {
    await initializeDatabase();
    const agent = await getTestAgent();
    const res = await agent
      .post('/auth/login')
      .send({ email: 'admin2@email.com', password: '123456' })
      .expect(200);

    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('uuid');
  });
});
