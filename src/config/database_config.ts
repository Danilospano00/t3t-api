import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';

/**
 * Interfaces
 */
export interface DatabaseConfigEnv {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  port: number;
  dialect: 'postgres';
  logging: boolean;
  dialectOptions?: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  define: {
    underscored: boolean;
    timestamps: boolean;
  };
}

export interface DatabaseConfig {
  development: DatabaseConfigEnv;
  staging: DatabaseConfigEnv;
  production: DatabaseConfigEnv;
}

/**
 * Database Configuration
 * Defines the configuration for different environments (local, staging, production).
 */
const databaseConfig: DatabaseConfig = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    dialect: 'postgres',
    logging: true,
    define: {
      underscored: true, // Use snake_case for column names
      timestamps: true,
    },
  },

  staging: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: true,
    define: {
      underscored: true, // Use snake_case for column names
      timestamps: true,
    },
  },

  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: true,
    define: {
      underscored: true, // Use snake_case for column names
      timestamps: true,
    },
  },
};

/**
 * Database Initialization
 * Initializes the Sequelize instance and connects to the database.
 */
let sequelize: Sequelize;

const initializeDatabaseConnection = async (databaseUrl: string) => {
  const env = (process.env.NODE_ENV || 'development') as keyof DatabaseConfig;
  const dbConfig: DatabaseConfigEnv = databaseConfig[env];

  sequelize = new Sequelize(
    dbConfig.database ?? '',
    dbConfig.username ?? '',
    dbConfig.password ?? '',
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
      models: [],
    },
  );

  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return sequelize;
  } catch (error) {
    console.log('Unable to connect to the database:', error);
    throw error;
  }
};

/**
 * Migration Management
 * Handles running pending migrations to update the database schema.
 */
async function applyPendingMigrations() {
  try {
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, '../migrations/*.js'),
        resolve: ({ name, path, context }) => {
          const migration = require(path ?? '');
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    // Apply all pending migrations
    const migrations = await umzug.up();
    if (migrations.length === 0) {
      console.log('ðŸ’¾  No pending migrations');
    } else {
      console.log(`ðŸ’¾  ${migrations.length} migration(s) applied:`);
      migrations.forEach((m) => console.log(`  - ${m.name}`));
    }
  } catch (err) {
    console.log('ðŸ’¾  Error during migrations:', err);
    process.exit(1);
  }
}

export { initializeDatabaseConnection, applyPendingMigrations, sequelize };
