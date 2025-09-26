import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1727222400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
        updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL UNIQUE,
        ean VARCHAR NOT NULL UNIQUE,
        price DECIMAL(12,2) NOT NULL,
        description TEXT,
        category_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
        updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT fk_products_category FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL,
        document VARCHAR NOT NULL UNIQUE,
        email VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        zip_code VARCHAR NOT NULL,
        number VARCHAR NOT NULL,
        city VARCHAR NOT NULL,
        state VARCHAR(2) NOT NULL,
        created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
        updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value DECIMAL(12,2) NOT NULL,
        discount DECIMAL(12,2) NOT NULL DEFAULT 0,
        product_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
        updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT fk_sales_product FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_sales_client FOREIGN KEY (client_id)
          REFERENCES clients(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS sales;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clients;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
  }
}
