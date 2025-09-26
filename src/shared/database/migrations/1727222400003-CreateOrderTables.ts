import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTables1727222400003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS order_items;`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders;`);
    await queryRunner.query(`DROP TABLE IF EXISTS order_statuses;`);
  }
}