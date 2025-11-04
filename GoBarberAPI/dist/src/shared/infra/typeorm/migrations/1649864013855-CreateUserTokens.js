"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class CreateUserTokens1649864013855 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user_tokens',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'token',
                    type: 'uuid',
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
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
            ],
            foreignKeys: [
                {
                    name: 'TokenUser',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['user_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('user_tokens');
    }
}
exports.default = CreateUserTokens1649864013855;
