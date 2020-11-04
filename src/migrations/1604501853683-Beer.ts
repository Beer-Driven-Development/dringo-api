import {MigrationInterface, QueryRunner} from "typeorm";

export class Beer1604501853683 implements MigrationInterface {
    name = 'Beer1604501853683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "beer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "abv" integer NOT NULL, "roomId" integer, CONSTRAINT "PK_68ce81153952014a6e8b20df5c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "beer" ADD CONSTRAINT "FK_5fd7372a759e8640d385c40cc9f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beer" DROP CONSTRAINT "FK_5fd7372a759e8640d385c40cc9f"`);
        await queryRunner.query(`DROP TABLE "beer"`);
    }

}
