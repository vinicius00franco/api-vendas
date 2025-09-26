import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "../../features/category/Category.js";
import { Product } from "../../features/product/Product.js";
import { Client } from "../../features/client/Client.js";
import { Sale } from "../../features/sales/Sale.js";

const isTestEnv = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: isTestEnv ? ":memory:" : "./database.sqlite",
  synchronize: false,
  logging: false,
  entities: [Category, Product, Client, Sale],
  migrations: ["src/shared/database/migrations/*.ts"],
});

export async function initializeDatabase(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  return AppDataSource.initialize();
}
