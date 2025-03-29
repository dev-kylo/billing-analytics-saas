/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('revenue_recognition', (table) => {
        table.increments('id').primary();

        table.integer('invoice_id').notNullable().references('id').inTable('invoices').onDelete('CASCADE'); // Optional: cascade delete if invoice is removed

        table.integer('subscription_id').notNullable().references('id').inTable('subscriptions').onDelete('CASCADE'); // Optional: cascade delete if subscription is removed

        table.decimal('amount', 12, 2).notNullable();

        table.date('recognition_start_date').notNullable();
        table.date('recognition_end_date').notNullable();

        table.string('currency', 3).notNullable(); // ISO 4217: 'USD', 'EUR', etc.

        table.string('status').notNullable().defaultTo('pending').checkIn(['pending', 'recognized', 'failed']); // Validate possible values

        table.timestamp('recognized_at'); // Optional: null until confirmed recognized

        table.timestamps(true, true); // created_at / updated_at

        // Index for analytics/reporting queries
        table.index(['recognition_start_date', 'recognition_end_date']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
