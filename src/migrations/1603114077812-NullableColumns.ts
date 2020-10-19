import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableColumns1603114077812 implements MigrationInterface {
    name = 'NullableColumns1603114077812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "salt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("email", "username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "salt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("email", "username")`);
    }

}
