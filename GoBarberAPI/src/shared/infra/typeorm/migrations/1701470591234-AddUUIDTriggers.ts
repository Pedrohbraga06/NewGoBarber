import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddUUIDTriggers1701470591234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a function to generate UUIDs
    await queryRunner.query(`
      CREATE TRIGGER IF NOT EXISTS appointments_uuid_trigger
      AFTER INSERT ON appointments
      WHEN NEW.id IS NULL
      BEGIN
        UPDATE appointments SET id = (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) WHERE rowid = NEW.rowid;
      END;
    `);

    await queryRunner.query(`
      CREATE TRIGGER IF NOT EXISTS users_uuid_trigger
      AFTER INSERT ON users
      WHEN NEW.id IS NULL
      BEGIN
        UPDATE users SET id = (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) WHERE rowid = NEW.rowid;
      END;
    `);

    await queryRunner.query(`
      CREATE TRIGGER IF NOT EXISTS user_tokens_uuid_trigger
      AFTER INSERT ON user_tokens
      WHEN NEW.id IS NULL
      BEGIN
        UPDATE user_tokens SET id = (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) WHERE rowid = NEW.rowid;
      END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS appointments_uuid_trigger');
    await queryRunner.query('DROP TRIGGER IF EXISTS users_uuid_trigger');
    await queryRunner.query('DROP TRIGGER IF EXISTS user_tokens_uuid_trigger');
  }
}