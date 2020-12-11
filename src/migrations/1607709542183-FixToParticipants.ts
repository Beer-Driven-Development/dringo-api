import {MigrationInterface, QueryRunner} from "typeorm";

export class FixToParticipants1607709542183 implements MigrationInterface {
    name = 'FixToParticipants1607709542183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1981a96b4c2cd5c72f1f8ee75a2"`);
        await queryRunner.query(`CREATE TABLE "room_participants_user" ("roomId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_91474a652732675f3109f834f57" PRIMARY KEY ("roomId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8e45f67ab744f53f2b9be8bd0d" ON "room_participants_user" ("roomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_43676f54e34f42f2dc0982ca2d" ON "room_participants_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "partiesId"`);
        await queryRunner.query(`ALTER TABLE "room_participants_user" ADD CONSTRAINT "FK_8e45f67ab744f53f2b9be8bd0da" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_participants_user" ADD CONSTRAINT "FK_43676f54e34f42f2dc0982ca2df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_participants_user" DROP CONSTRAINT "FK_43676f54e34f42f2dc0982ca2df"`);
        await queryRunner.query(`ALTER TABLE "room_participants_user" DROP CONSTRAINT "FK_8e45f67ab744f53f2b9be8bd0da"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "partiesId" integer`);
        await queryRunner.query(`DROP INDEX "IDX_43676f54e34f42f2dc0982ca2d"`);
        await queryRunner.query(`DROP INDEX "IDX_8e45f67ab744f53f2b9be8bd0d"`);
        await queryRunner.query(`DROP TABLE "room_participants_user"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1981a96b4c2cd5c72f1f8ee75a2" FOREIGN KEY ("partiesId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
