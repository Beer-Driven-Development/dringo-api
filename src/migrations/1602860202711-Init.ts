import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1602860202711 implements MigrationInterface {
    name = 'Init1602860202711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("email", "username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
