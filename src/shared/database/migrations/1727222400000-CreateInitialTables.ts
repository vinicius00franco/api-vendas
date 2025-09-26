import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1727222400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita a extensão para geração de UUIDs
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // -- GRUPO: ENDEREÇOS E GEOGRAFIA (Sem dependências externas) --
    await queryRunner.query(`
      CREATE TABLE states (
        sta_id SERIAL PRIMARY KEY,
        sta_name VARCHAR(100) NOT NULL UNIQUE,
        sta_uf VARCHAR(2) NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE cities (
        cit_id SERIAL PRIMARY KEY,
        cit_sta_id INT NOT NULL,
        cit_name VARCHAR(150) NOT NULL,
        CONSTRAINT fk_cities_state FOREIGN KEY (cit_sta_id)
          REFERENCES states(sta_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE address_types (
        aty_id SERIAL PRIMARY KEY,
        aty_name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

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

    // -- GRUPO: GESTÃO DE CLIENTES --
    await queryRunner.query(`
      CREATE TABLE clients (
        cli_id BIGSERIAL PRIMARY KEY,
        cli_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        cli_name VARCHAR(255) NOT NULL,
        cli_email VARCHAR(255) NOT NULL UNIQUE,
        cli_phone VARCHAR(20),
        cli_created_at TIMESTAMPTZ DEFAULT NOW(),
        cli_updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    await queryRunner.query(`
      CREATE TABLE person_details (
        pdt_cli_id BIGINT PRIMARY KEY,
        pdt_cpf VARCHAR(11) NOT NULL UNIQUE,
        pdt_birth_date DATE,
        CONSTRAINT fk_person_client FOREIGN KEY (pdt_cli_id)
          REFERENCES clients(cli_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE company_details (
        cdt_cli_id BIGINT PRIMARY KEY,
        cdt_cnpj VARCHAR(14) NOT NULL UNIQUE,
        cdt_legal_name VARCHAR(255) NOT NULL,
        CONSTRAINT fk_company_client FOREIGN KEY (cdt_cli_id)
          REFERENCES clients(cli_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE addresses (
        adr_id BIGSERIAL PRIMARY KEY,
        adr_cli_id BIGINT NOT NULL,
        adr_cit_id INT NOT NULL,
        adr_aty_id INT NOT NULL,
        adr_street VARCHAR(255) NOT NULL,
        adr_number VARCHAR(20),
        adr_complement VARCHAR(100),
        adr_neighborhood VARCHAR(100) NOT NULL,
        adr_zip_code VARCHAR(9) NOT NULL,
        adr_created_at TIMESTAMPTZ DEFAULT NOW(),
        adr_updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_addresses_client FOREIGN KEY (adr_cli_id)
          REFERENCES clients(cli_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_addresses_city FOREIGN KEY (adr_cit_id)
          REFERENCES cities(cit_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT,
        CONSTRAINT fk_addresses_type FOREIGN KEY (adr_aty_id)
          REFERENCES address_types(aty_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );
    `);

    // -- GRUPO: PEDIDOS E ENTREGA --
    await queryRunner.query(`
      CREATE TABLE order_statuses (
        ost_id SERIAL PRIMARY KEY,
        ost_name VARCHAR(50) NOT NULL UNIQUE,
        ost_description TEXT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE orders (
        ord_id BIGSERIAL PRIMARY KEY,
        ord_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        ord_cli_id BIGINT NOT NULL,
        ord_ost_id INT NOT NULL,
        ord_total_value DECIMAL(12,2) NOT NULL,
        ord_total_discount DECIMAL(12,2) DEFAULT 0,
        ord_created_at TIMESTAMPTZ DEFAULT NOW(),
        ord_updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_orders_client FOREIGN KEY (ord_cli_id)
          REFERENCES clients(cli_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT,
        CONSTRAINT fk_orders_status FOREIGN KEY (ord_ost_id)
          REFERENCES order_statuses(ost_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE order_items (
        oit_id BIGSERIAL PRIMARY KEY,
        oit_ord_id BIGINT NOT NULL,
        oit_pva_id BIGINT NOT NULL,
        oit_quantity INT NOT NULL CHECK (oit_quantity > 0),
        oit_unit_price DECIMAL(12,2) NOT NULL,
        oit_discount DECIMAL(12,2) DEFAULT 0,
        CONSTRAINT fk_items_order FOREIGN KEY (oit_ord_id)
          REFERENCES orders(ord_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_items_variant FOREIGN KEY (oit_pva_id)
          REFERENCES product_variants(pva_id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );
    `);

    // -- GRUPO: SEGURANÇA E ACESSO (RBAC) --
    await queryRunner.query(`
      CREATE TABLE users (
        usr_id BIGSERIAL PRIMARY KEY,
        usr_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
        usr_name VARCHAR(255) NOT NULL,
        usr_email VARCHAR(255) NOT NULL UNIQUE,
        usr_password_hash VARCHAR(255) NOT NULL,
        usr_created_at TIMESTAMPTZ DEFAULT NOW(),
        usr_updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE roles (
        rol_id SERIAL PRIMARY KEY,
        rol_name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE user_roles (
        uro_usr_id BIGINT NOT NULL,
        uro_rol_id INT NOT NULL,
        PRIMARY KEY (uro_usr_id, uro_rol_id),
        CONSTRAINT fk_userroles_user FOREIGN KEY (uro_usr_id)
          REFERENCES users(usr_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_userroles_role FOREIGN KEY (uro_rol_id)
          REFERENCES roles(rol_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
    
    // -- GRUPO: TABELAS DE AUDITORIA --
    await queryRunner.query(`
      CREATE TABLE products_audit_log (
        pal_id BIGSERIAL PRIMARY KEY,
        pal_operation_type VARCHAR(6) NOT NULL, -- INSERT, UPDATE, DELETE
        pal_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        pal_usr_id BIGINT, -- Usuário que fez a mudança
        pro_id BIGINT,
        pro_uuid UUID,
        pro_cat_id BIGINT,
        pro_brd_id BIGINT,
        pro_name VARCHAR,
        pro_description TEXT,
        pro_created_at TIMESTAMPTZ,
        pro_updated_at TIMESTAMPTZ,
        CONSTRAINT fk_audit_products_user FOREIGN KEY (pal_usr_id)
          REFERENCES users(usr_id)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE clients_audit_log (
        cal_id BIGSERIAL PRIMARY KEY,
        cal_operation_type VARCHAR(6) NOT NULL,
        cal_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        cal_usr_id BIGINT,
        cli_id BIGINT,
        cli_uuid UUID,
        cli_name VARCHAR,
        cli_email VARCHAR,
        cli_phone VARCHAR,
        cli_created_at TIMESTAMPTZ,
        cli_updated_at TIMESTAMPTZ,
        CONSTRAINT fk_audit_clients_user FOREIGN KEY (cal_usr_id)
          REFERENCES users(usr_id)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE orders_audit_log (
        oal_id BIGSERIAL PRIMARY KEY,
        oal_operation_type VARCHAR(6) NOT NULL,
        oal_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        oal_usr_id BIGINT,
        ord_id BIGINT,
        ord_uuid UUID,
        ord_cli_id BIGINT,
        ord_ost_id INT,
        ord_total_value DECIMAL(12,2),
        ord_total_discount DECIMAL(12,2),
        ord_created_at TIMESTAMPTZ,
        ord_updated_at TIMESTAMPTZ,
        CONSTRAINT fk_audit_orders_user FOREIGN KEY (oal_usr_id)
          REFERENCES users(usr_id)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // A ordem de remoção é o inverso da ordem de criação para respeitar as chaves estrangeiras

    // -- GRUPO: TABELAS DE AUDITORIA --
    await queryRunner.query(`DROP TABLE IF EXISTS orders_audit_log;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clients_audit_log;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products_audit_log;`);

    // -- GRUPO: SEGURANÇA E ACESSO (RBAC) --
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);

    // -- GRUPO: PEDIDOS E ENTREGA --
    await queryRunner.query(`DROP TABLE IF EXISTS order_items;`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders;`);
    await queryRunner.query(`DROP TABLE IF EXISTS order_statuses;`);

    // -- GRUPO: GESTÃO DE CLIENTES --
    await queryRunner.query(`DROP TABLE IF EXISTS addresses;`);
    await queryRunner.query(`DROP TABLE IF EXISTS company_details;`);
    await queryRunner.query(`DROP TABLE IF EXISTS person_details;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clients;`);

    // -- GRUPO: PRODUTO E CATÁLOGO --
    await queryRunner.query(`DROP TABLE IF EXISTS product_variants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);
    await queryRunner.query(`DROP TABLE IF EXISTS brands;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);

    // -- GRUPO: ENDEREÇOS E GEOGRAFIA --
    await queryRunner.query(`DROP TABLE IF EXISTS address_types;`);
    await queryRunner.query(`DROP TABLE IF EXISTS cities;`);
    await queryRunner.query(`DROP TABLE IF EXISTS states;`);
  }
}
