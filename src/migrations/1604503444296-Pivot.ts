import {MigrationInterface, QueryRunner} from "typeorm";

export class Pivot1604503444296 implements MigrationInterface {
    name = 'Pivot1604503444296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pivot" ("id" SERIAL NOT NULL, "weight" integer NOT NULL, "categoryId" integer, "roomId" integer, CONSTRAINT "PK_9ff7dd89e442bcf2860c233a02f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pivot" ADD CONSTRAINT "FK_eb7a812289620a6d52b6a06df2c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pivot" ADD CONSTRAINT "FK_a101200433d8699cf9c4a2b011b" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pivot" DROP CONSTRAINT "FK_a101200433d8699cf9c4a2b011b"`);
        await queryRunner.query(`ALTER TABLE "pivot" DROP CONSTRAINT "FK_eb7a812289620a6d52b6a06df2c"`);
        await queryRunner.query(`DROP TABLE "pivot"`);
    }

}
