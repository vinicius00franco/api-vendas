import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default async function globalTeardown() {
  const { AppDataSource } = require('../src/shared/database/data-source.ts');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
