/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('customers', (table) => {
        /**
         * CREATE TABLE customers (
         * id SERIAL PRIMARY KEY,
         * firstname VARCHAR(250) NOT NULL,
         * surname VARCHAR(250) NOT NULL,
         * email VARCHAR(100) UNIQUE NOT NULL
         *
         *
         * CREATE INDEX indx_customers_email
         * ON customers(email)
         * )
         */

        table.increments('id').primary();
        table.string('firstname', 250).notNullable();
        table.string('surname', 250).notNullable();
        table.string('email', 100).notNullable();

        table.index('email', 'idx_customers_email');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    /**
     * DROP TABLE customers
     */

    return knex.schema.dropTableIfExists('customers');
};
