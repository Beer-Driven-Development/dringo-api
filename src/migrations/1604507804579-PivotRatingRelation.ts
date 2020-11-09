import {MigrationInterface, QueryRunner} from "typeorm";

export class PivotRatingRelation1604507804579 implements MigrationInterface {
    name = 'PivotRatingRelation1604507804579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" ADD "pivotId" integer`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_951dd5b8d50884971615abbccaa" FOREIGN KEY ("pivotId") REFERENCES "pivot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_951dd5b8d50884971615abbccaa"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "pivotId"`);
    }

}
