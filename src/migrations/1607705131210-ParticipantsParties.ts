import {MigrationInterface, QueryRunner} from "typeorm";

export class ParticipantsParties1607705131210 implements MigrationInterface {
    name = 'ParticipantsParties1607705131210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "partiesId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1981a96b4c2cd5c72f1f8ee75a2" FOREIGN KEY ("partiesId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1981a96b4c2cd5c72f1f8ee75a2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "partiesId"`);
    }

}
