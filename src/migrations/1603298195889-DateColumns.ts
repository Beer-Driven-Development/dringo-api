import {MigrationInterface, QueryRunner} from "typeorm";

export class DateColumns1603298195889 implements MigrationInterface {
    name = 'DateColumns1603298195889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "room" ADD "startedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "room" ADD "finishedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "finishedAt"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "startedAt"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "createdAt"`);
    }

}
