import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
  } from 'typeorm';
  
  export default class AlterProviderFieldToProviderId1625177608216
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.renameColumn('appointments', 'provider', 'provider_id');
  
      await queryRunner.createForeignKey(
        'appointments',
        new TableForeignKey({
          name: 'AppointmentProvider',
          columnNames: ['provider_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
      await queryRunner.renameColumn('appointments', 'provider_id', 'provider');
    }
  }