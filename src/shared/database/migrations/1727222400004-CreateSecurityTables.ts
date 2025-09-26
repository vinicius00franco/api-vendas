import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSecurityTables1727222400004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}