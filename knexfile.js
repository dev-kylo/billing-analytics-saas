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
        client: 'better-sqlite3',
        connection: {
            filename: ':memory:', // 👈 in-memory DB (fast + isolated)
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        },
    },
};
