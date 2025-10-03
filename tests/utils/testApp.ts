import request from 'supertest';
import { app } from '../../src/app.js';
import { initializeDatabase } from '../../src/shared/database/data-source.js';

export async function getTestAgent() {
  await initializeDatabase();
  return request(app);
}
