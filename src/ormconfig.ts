import { ConnectionOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import * as fs from 'fs';

//const environment = process.env.NODE_ENV || 'development';
const data: any = dotenv.parse(fs.readFileSync('.env'));

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: data.DB_TYPE,
  host: data.DB_HOST,
  port: data.DB_PORT,
  username: data.DB_USERNAME,
  password: data.DB_PASSWORD,
  database: data.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

export = config;
