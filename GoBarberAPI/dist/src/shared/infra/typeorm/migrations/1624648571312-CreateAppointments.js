"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class CreateAppointments1624648571312 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'appointments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'provider',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'date',
                    type: 'timestamp with time zone',
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('appointments');
    }
}
exports.default = CreateAppointments1624648571312;
