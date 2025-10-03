import { AsyncLocalStorage } from 'node:async_hooks';
import { AppDataSource } from './data-source.js';
import type { EntityManager, Repository, ObjectLiteral } from 'typeorm';

const storage = new AsyncLocalStorage<EntityManager>();

export function setActiveManager(manager: EntityManager) {
  // Bind the current async execution context to this manager
  storage.enterWith(manager);
}

export function clearActiveManager() {
  storage.disable();
}

export function getActiveManager(): EntityManager | null {
  return storage.getStore() ?? null;
}

export function repo<T extends ObjectLiteral>(target: any): Repository<T> {
  const mgr = getActiveManager();
  return (mgr ?? AppDataSource).getRepository<T>(target);
}
