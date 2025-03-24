require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    // local: {
    //   client: 'sqlite3',
    //   connection: {
    //     filename: './dev.sqlite3'
    //   }
    // },

    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
        },
        migrations: {
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: './src/seeds',
        },
    },
    test: {
        client: 'pg',
        connection: {
            host: process.env.TEST_DB_HOST || 'localhost',
            port: process.env.TEST_DB_PORT || 5432,
            database: process.env.TEST_DB_NAME,
            user: process.env.TEST_DB_USER || 'postgres',
            password: process.env.TEST_DB_PASSWORD || 'postgres',
        },
        migrations: {
            directory: './src/migrations',
            tableName: 'knex_migrations',
        },
    },
};
