import {MigrationInterface, QueryRunner} from "typeorm";

export class RoomIsPublished1604503976893 implements MigrationInterface {
    name = 'RoomIsPublished1604503976893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "isPublished" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "isPublished"`);
    }

}
