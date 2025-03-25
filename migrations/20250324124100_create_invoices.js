/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    // CREATE TABLE invoices (
    //     id SERIAL PRIMARY KEY,
    //     customer_id INTEGER NOT NULL REFERENCES customers(id),
    //     subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
    //     invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     due_date TIMESTAMP NOT NULL,
    //     period_start TIMESTAMP,          -- Start of the billing period (if applicable)
    //     period_end TIMESTAMP,            -- End of the billing period (if applicable)
    //     paid_date TIMESTAMP,             -- When the invoice was paid (if applicable)
    //     amount DECIMAL(10, 2) NOT NULL,   -- Invoice amount for revenue calculations
    //     status VARCHAR(50) NOT NULL,      -- e.g., 'pending', 'paid', 'overdue'
    //     currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );

    return knex.schema.createTable('invoices', (table) => {
        table.increments('id');

        table.integer('customer_id').notNullable();
        table.foreign('customer_id').references('customers.id').onDelete('CASCADE');

        table.integer('subscription_id').notNullable();
        table.foreign('subscription_id').references('subscriptions.id').onDelete('CASCADE');

        table.timestamp('invoice_date').notNullable().defaultTo(knex.fn.now());
        table.timestamp('due_date').notNullable();
        table.timestamp('period_start');
        table.timestamp('period_end');
        table.timestamp('paid_date');

        table.decimal('amount', 10, 2).notNullable();
        table.string('status', 50).notNullable().checkIn(['pending', 'paid', 'overdue']);
        table.string('currency', 10).notNullable().defaultTo('USD');

        table.timestamps(true, true);

        // Add useful indexes
        table.index('customer_id');
        table.index('subscription_id');
        table.index('status');
        table.index('invoice_date');
        table.index('due_date');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('invoices');
};
