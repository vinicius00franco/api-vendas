import 'reflect-metadata';
import { setActiveManager, clearActiveManager } from '../src/shared/database/transaction-context.js';
import { AppDataSource, initializeDatabase } from '../src/shared/database/data-source.js';

beforeAll(async () => {
  await initializeDatabase();
  // Seed admin user
  const { default: UserService } = await import('../src/features/user/UserService.js');
  const userService = new UserService();
  const existing = await userService.findByEmail('admin2@email.com');
  if (!existing) {
    await userService.create({ name: 'Admin', email: 'admin2@email.com', password: '123456', isAdmin: true });
  }
});

let queryRunner: import('typeorm').QueryRunner | null = null;

beforeEach(async () => {
  queryRunner = AppDataSource.createQueryRunner();
  await queryRunner!.connect();
  await queryRunner!.startTransaction();
  setActiveManager(queryRunner!.manager);
});

afterEach(async () => {
  try {
    if (queryRunner) {
      await queryRunner.rollbackTransaction();
    }
  } finally {
    clearActiveManager();
    if (queryRunner) {
      await queryRunner.release();
      queryRunner = null;
    }
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
