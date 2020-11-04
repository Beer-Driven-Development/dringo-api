import {MigrationInterface, QueryRunner} from "typeorm";

export class BeerABVFloat1604502126590 implements MigrationInterface {
    name = 'BeerABVFloat1604502126590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beer" DROP COLUMN "abv"`);
        await queryRunner.query(`ALTER TABLE "beer" ADD "abv" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beer" DROP COLUMN "abv"`);
        await queryRunner.query(`ALTER TABLE "beer" ADD "abv" integer NOT NULL`);
    }

}
