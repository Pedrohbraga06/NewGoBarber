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
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'provider',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'date',
                    type: 'datetime',
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
