import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterAvatarFieldToNullable1762309954401 implements MigrationInterface {
    name = 'AlterAvatarFieldToNullable1762309954401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()), "user_id" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_appointments"("id", "provider_id", "date", "created_at", "updated_at", "user_id") SELECT "id", "provider_id", "date", "created_at", "updated_at", "user_id" FROM "appointments"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`ALTER TABLE "temporary_appointments" RENAME TO "appointments"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "user_id" varchar NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()))`);
        await queryRunner.query(`INSERT INTO "temporary_user_tokens"("id", "token", "user_id", "created_at", "updated_at") SELECT "id", "token", "user_id", "created_at", "updated_at" FROM "user_tokens"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_tokens" RENAME TO "user_tokens"`);
        await queryRunner.query(`CREATE TABLE "temporary_appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()))`);
        await queryRunner.query(`INSERT INTO "temporary_appointments"("id", "provider_id", "date", "created_at", "updated_at") SELECT "id", "provider_id", "date", "created_at", "updated_at" FROM "appointments"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`ALTER TABLE "temporary_appointments" RENAME TO "appointments"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "avatar" varchar, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "name", "email", "password", "created_at", "updated_at", "avatar") SELECT "id", "name", "email", "password", "created_at", "updated_at", "avatar" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_appointments"("id", "provider_id", "date", "created_at", "updated_at") SELECT "id", "provider_id", "date", "created_at", "updated_at" FROM "appointments"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`ALTER TABLE "temporary_appointments" RENAME TO "appointments"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_user_tokens"("id", "token", "user_id", "created_at", "updated_at") SELECT "id", "token", "user_id", "created_at", "updated_at" FROM "user_tokens"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_tokens" RENAME TO "user_tokens"`);
        await queryRunner.query(`CREATE TABLE "temporary_appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_e3e268ed1125872144e68b9a41c" FOREIGN KEY ("provider_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_appointments"("id", "provider_id", "date", "created_at", "updated_at") SELECT "id", "provider_id", "date", "created_at", "updated_at" FROM "appointments"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`ALTER TABLE "temporary_appointments" RENAME TO "appointments"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" RENAME TO "temporary_appointments"`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "appointments"("id", "provider_id", "date", "created_at", "updated_at") SELECT "id", "provider_id", "date", "created_at", "updated_at" FROM "temporary_appointments"`);
        await queryRunner.query(`DROP TABLE "temporary_appointments"`);
        await queryRunner.query(`ALTER TABLE "user_tokens" RENAME TO "temporary_user_tokens"`);
        await queryRunner.query(`CREATE TABLE "user_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "user_id" varchar NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()))`);
        await queryRunner.query(`INSERT INTO "user_tokens"("id", "token", "user_id", "created_at", "updated_at") SELECT "id", "token", "user_id", "created_at", "updated_at" FROM "temporary_user_tokens"`);
        await queryRunner.query(`DROP TABLE "temporary_user_tokens"`);
        await queryRunner.query(`ALTER TABLE "appointments" RENAME TO "temporary_appointments"`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()))`);
        await queryRunner.query(`INSERT INTO "appointments"("id", "provider_id", "date", "created_at", "updated_at") SELECT "id", "provider_id", "date", "created_at", "updated_at" FROM "temporary_appointments"`);
        await queryRunner.query(`DROP TABLE "temporary_appointments"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()), "avatar" varchar, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "password", "created_at", "updated_at", "avatar") SELECT "id", "name", "email", "password", "created_at", "updated_at", "avatar" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "appointments" RENAME TO "temporary_appointments"`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()), "user_id" varchar)`);
        await queryRunner.query(`INSERT INTO "appointments"("id", "provider_id", "date", "created_at", "updated_at") SELECT "id", "provider_id", "date", "created_at", "updated_at" FROM "temporary_appointments"`);
        await queryRunner.query(`DROP TABLE "temporary_appointments"`);
        await queryRunner.query(`ALTER TABLE "user_tokens" RENAME TO "temporary_user_tokens"`);
        await queryRunner.query(`CREATE TABLE "user_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "user_id" varchar NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()), CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "user_tokens"("id", "token", "user_id", "created_at", "updated_at") SELECT "id", "token", "user_id", "created_at", "updated_at" FROM "temporary_user_tokens"`);
        await queryRunner.query(`DROP TABLE "temporary_user_tokens"`);
        await queryRunner.query(`ALTER TABLE "appointments" RENAME TO "temporary_appointments"`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" varchar PRIMARY KEY NOT NULL, "provider_id" varchar NOT NULL, "date" datetime NOT NULL, "created_at" timestamp NOT NULL DEFAULT (now()), "updated_at" timestamp NOT NULL DEFAULT (now()), "user_id" varchar, CONSTRAINT "FK_66dee3bea82328659a4db8e54b7" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE, CONSTRAINT "FK_e3e268ed1125872144e68b9a41c" FOREIGN KEY ("provider_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "appointments"("id", "provider_id", "date", "created_at", "updated_at", "user_id") SELECT "id", "provider_id", "date", "created_at", "updated_at", "user_id" FROM "temporary_appointments"`);
        await queryRunner.query(`DROP TABLE "temporary_appointments"`);
    }

}
