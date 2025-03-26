/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('subscription_changes', (table) => {
        table.increments('id').primary();

        table.integer('subscription_id').notNullable();
        table.foreign('subscription_id').references('subscriptions.id').onDelete('CASCADE');

        table.decimal('previous_price', 10, 2).notNullable();
        table.decimal('new_price', 10, 2).notNullable();
        table.string('previous_billing_frequency');
        table.string('new_billing_frequency');
        table.decimal('prorated_amount', 10, 2);
        table.decimal('refund_amount', 10, 2);
        table.string('change_type').notNullable(); // upgrade, downgrade, frequency_change, etc.
        table.timestamp('effective_date').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.alterTable('invoices', (table) => {
        table.decimal('refund_amount', 10, 2).defaultTo(0);
        table.decimal('total_amount', 10, 2);
        table.boolean('is_prorated').defaultTo(false);
    });

    await knex.schema.alterTable('subscriptions', (table) => {
        table.decimal('previous_price', 10, 2);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('subscription_changes');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('subscription_changes');

    await knex.schema.alterTable('invoices', (table) => {
        table.dropColumn('refund_amount');
        table.dropColumn('total_amount');
        table.dropColumn('is_prorated');
    });
    await knex.schema.alterTable('subscriptions', (table) => {
        table.dropColumn('previous_price');
    });
};
