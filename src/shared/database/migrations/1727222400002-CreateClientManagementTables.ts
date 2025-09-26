import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientManagementTables1727222400002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS addresses;`);
    await queryRunner.query(`DROP TABLE IF EXISTS company_details;`);
    await queryRunner.query(`DROP TABLE IF EXISTS person_details;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clients;`);
  }
}