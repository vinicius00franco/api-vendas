import 'reflect-metadata';
// use dynamic import with explicit .js extensions; ts-jest will map to TS sources

export default async function globalSetup() {
  // Ensure env is set (duplicated safety with tests/env.ts)
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  process.env.DB_HOST = process.env.DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT || '5435';
  process.env.DB_USER = process.env.DB_USER || 'user';
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
  process.env.DB_NAME = process.env.DB_NAME || 'api_vendas';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

  // @ts-ignore - ESM path with .js is resolved by ts-jest
  const { initializeDatabase } = await import('../src/shared/database/data-source.js');
  await initializeDatabase();

  // Seed admin user
  // @ts-ignore - ESM path with .js is resolved by ts-jest
  const { default: UserService } = await import('../src/features/user/UserService.js');
  const userService = new UserService();
  const existing = await userService.findByEmail('admin2@email.com');
  if (!existing) {
    await userService.create({ name: 'Admin', email: 'admin2@email.com', password: '123456', isAdmin: true });
  }
}
