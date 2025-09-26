import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditTables1727222400005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`DROP TABLE IF EXISTS orders_audit_log;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clients_audit_log;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products_audit_log;`);
  }
}