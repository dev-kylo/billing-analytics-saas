// Update with your config settings.

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
        client: 'postgresql',
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
    },
};
