"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class AddUserIdToAppointments1651870224591 {
    async up(queryRunner) {
        await queryRunner.addColumn('appointments', new typeorm_1.TableColumn({
            name: 'user_id',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('appointments', new typeorm_1.TableForeignKey({
            name: 'AppointmentUser',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('appointments', 'AppointmentUser');
        await queryRunner.dropColumn('appointments', 'user_id');
    }
}
exports.default = AddUserIdToAppointments1651870224591;
