import { ConnectionOptions } from 'typeorm';
import path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const configSeed: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../seeds/**/*.{ts,js}')],
  cli: {
    migrationsDir: 'src/orm/seeds',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export = configSeed;
