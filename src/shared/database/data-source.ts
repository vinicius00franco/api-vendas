import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "../../features/category/Category.js";
import { Product } from "../../features/product/Product.js";
import { ProductVariant } from "../../features/product/ProductVariant.js";
import { Brand } from "../../features/brand/Brand.js";
import { Client } from "../../features/client/Client.js";
import { User } from "../../features/user/User.js";

const isTestEnv = process.env.NODE_ENV === "test";

const defaultPostgresConfig = {
  type: "postgres" as const,
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "api_vendas",
};

export const AppDataSource = new DataSource({
  ...(defaultPostgresConfig),
  synchronize: false,
  logging: false,
  entities: [Category, Brand, Product, ProductVariant, Client, User],
  migrations: ["src/shared/database/migrations/*.ts"],
  ...(isTestEnv
    ? {
        database: process.env.DB_NAME ?? "api_vendas_test",
      }
    : {}),
});

export async function initializeDatabase(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  return AppDataSource.initialize();
}
