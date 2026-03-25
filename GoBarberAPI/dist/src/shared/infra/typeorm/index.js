"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const isDevelopment = process.env.NODE_ENV !== 'production';
// In development, use SQLite for easier setup
const devConfig = {
    type: 'sqlite',
    database: path_1.default.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'gobarber.sqlite'),
    entities: [path_1.default.resolve(__dirname, '..', '..', '..', 'modules', '**', 'infra', 'typeorm', 'entities', '*{.ts,.js}')],
    migrations: [path_1.default.resolve(__dirname, 'migrations', '*{.ts,.js}')],
    cli: {
        migrationsDir: path_1.default.resolve(__dirname, 'migrations')
    },
    synchronize: true, // auto-create tables in development
};
// In production, use PostgreSQL with environment variables or ormconfig.json
const prodConfig = require('../../../../ormconfig.json');
const productionConfig = Object.assign({}, prodConfig, {
    host: process.env.DB_HOST || prodConfig.host,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : prodConfig.port,
    username: process.env.DB_USER || prodConfig.username,
    password: process.env.DB_PASS || prodConfig.password,
    database: process.env.DB_NAME || prodConfig.database,
});
const connectionConfig = isDevelopment ? devConfig : productionConfig;
(0, typeorm_1.createConnection)(connectionConfig)
    .then(() => {
    console.log(`Database connected successfully using ${isDevelopment ? 'SQLite (dev)' : 'PostgreSQL (prod)'}`);
})
    .catch(error => {
    console.error('TypeORM connection error:', error);
});
