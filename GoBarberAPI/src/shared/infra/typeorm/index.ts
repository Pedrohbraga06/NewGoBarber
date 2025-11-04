import { createConnection } from 'typeorm';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

// In development, use SQLite for easier setup
const devConfig = {
  type: 'sqlite' as const,
  database: path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'gobarber.sqlite'),
  entities: [path.resolve(__dirname, '..', '..', '..', 'modules', '**', 'infra', 'typeorm', 'entities', '*{.ts,.js}')],
  migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}')],
  cli: {
    migrationsDir: path.resolve(__dirname, 'migrations')
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

createConnection(connectionConfig)
  .then(() => {
    console.log(`Database connected successfully using ${isDevelopment ? 'SQLite (dev)' : 'PostgreSQL (prod)'}`);
  })
  .catch(error => {
    console.error('TypeORM connection error:', error);
  });
