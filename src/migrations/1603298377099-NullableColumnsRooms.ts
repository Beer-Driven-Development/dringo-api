import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableColumnsRooms1603298377099 implements MigrationInterface {
    name = 'NullableColumnsRooms1603298377099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "startedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "finishedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "finishedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "startedAt" SET NOT NULL`);
    }

}
