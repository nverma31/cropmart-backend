import { ConnectionOptions } from 'typeorm';
import path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscriber/**/*.{ts,js}')],
  cli: {
    entitiesDir: 'src/orm/entities',
    migrationsDir: 'src/orm/migrations',
    subscribersDir: 'src/orm/subscriber',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export = config;
