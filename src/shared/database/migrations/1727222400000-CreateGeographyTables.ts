import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGeographyTables1727222400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita a extensão para geração de UUIDs (se necessário para futuras tabelas)
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS address_types;`);
    await queryRunner.query(`DROP TABLE IF EXISTS cities;`);
    await queryRunner.query(`DROP TABLE IF EXISTS states;`);
  }
}