import {MigrationInterface, QueryRunner} from "typeorm";

export class Rating1604502823705 implements MigrationInterface {
    name = 'Rating1604502823705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rating" ("id" SERIAL NOT NULL, "score" double precision NOT NULL, "beerId" integer, "evaluatorId" integer, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_10a400fb4723f19cc25dd847558" FOREIGN KEY ("beerId") REFERENCES "beer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_c2f458603a5c6b79a9f79f513dc" FOREIGN KEY ("evaluatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_c2f458603a5c6b79a9f79f513dc"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_10a400fb4723f19cc25dd847558"`);
        await queryRunner.query(`DROP TABLE "rating"`);
    }

}
