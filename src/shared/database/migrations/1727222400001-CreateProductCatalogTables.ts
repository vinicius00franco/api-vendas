import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductCatalogTables1727222400001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // -- GRUPO: PRODUTO E CATÁLOGO --
    await queryRunner.query(`
      CREATE TABLE categories (
        cat_id BIGSERIAL PRIMARY KEY,
        cat_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        cat_parent_id BIGINT,
        cat_name VARCHAR(100) NOT NULL,
        cat_description TEXT,
        cat_created_at TIMESTAMPTZ DEFAULT NOW(),
        cat_updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_categories_parent FOREIGN KEY (cat_parent_id)
          REFERENCES categories(cat_id)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE brands (
        brd_id BIGSERIAL PRIMARY KEY,
        brd_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        brd_name VARCHAR(100) NOT NULL UNIQUE,
        brd_created_at TIMESTAMPTZ DEFAULT NOW(),
        brd_updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE products (
        pro_id BIGSERIAL PRIMARY KEY,
        pro_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        pro_cat_id BIGINT NOT NULL,
        pro_brd_id BIGINT NOT NULL,
        pro_name VARCHAR(255) NOT NULL,
        pro_description TEXT,
        pro_created_at TIMESTAMPTZ DEFAULT NOW(),
        pro_updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_products_category FOREIGN KEY (pro_cat_id)
          REFERENCES categories(cat_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT,
        CONSTRAINT fk_products_brand FOREIGN KEY (pro_brd_id)
          REFERENCES brands(brd_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );
    `);
    
    await queryRunner.query(`
      CREATE TABLE product_variants (
        pva_id BIGSERIAL PRIMARY KEY,
        pva_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        pva_pro_id BIGINT NOT NULL,
        pva_sku VARCHAR(100) UNIQUE,
        pva_ean VARCHAR(13) UNIQUE,
        pva_price DECIMAL(12,2) NOT NULL CHECK (pva_price >= 0),
        pva_stock_quantity INT NOT NULL DEFAULT 0 CHECK (pva_stock_quantity >= 0),
        pva_created_at TIMESTAMPTZ DEFAULT NOW(),
        pva_updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_variants_product FOREIGN KEY (pva_pro_id)
          REFERENCES products(pro_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS product_variants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);
    await queryRunner.query(`DROP TABLE IF EXISTS brands;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
  }
}