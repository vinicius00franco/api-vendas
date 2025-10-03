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
});
