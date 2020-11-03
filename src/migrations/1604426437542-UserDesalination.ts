import {MigrationInterface, QueryRunner} from "typeorm";

export class UserDesalination1604426437542 implements MigrationInterface {
    name = 'UserDesalination1604426437542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "salt" character varying`);
    }

}
