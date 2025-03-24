/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    /**
     * CREATE TABLE subscriptions(
     *  id SERIAL PRIMARY KEY,
     *  price NUMERIC(10, 2) NOT NULL,
     *  billing_frequency VARCHAR(50) NOT NULL,
     *  status VARCHAR(50) NOT NULL,
     *  trial_end_date TIMESTAMP,
     *  next_billing_date TIMESTAMP,
     *  currency VARCHAR(50) NOT NULL
     *  auto_renew BOOLEAN
     *  start_date TIMESTAMP,
     *  end_date TIMESTAMP,
     *  cancellation_date TIMESTAMP,
     *  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     *  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     * )
     *
     */

    return knex.schema.createTable('subscriptions', (table) => {
        table.increments('id');

        table.integer('customer_id').notNullable();
        table.foreign('customer_id').references('customers.id').onDelete('CASCADE');

        table.decimal('price', 10, 2).notNullable();
        table.text('billing_frequency').checkIn(['monthly', 'quarterly', 'annually']);
        table.text('plan').notNullable().checkIn(['basic', 'pro', 'enterprise']);
        table.text('status').notNullable().checkIn(['active', 'cancelled', 'paused', 'annually', 'trial']);
        table.timestamp('trial_start_date');
        table.timestamp('trial_end_date');
        table.timestamp('next_billing_date');

        table.string('currency', 50).notNullable();
        table.boolean('auto_renew');

        table.timestamp('start_date');
        table.timestamp('end_date');
        table.timestamp('cancellation_date');

        table.timestamps(true, true);

        table.index('customer_id');
        table.index('status');
        table.index(['customer_id', 'status']);
        table.index('billing_frequency');
        table.index('next_billing_date');
        table.index('trial_end_date');
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

    return knex.schema.dropTableIfExists('subscriptions');
};
