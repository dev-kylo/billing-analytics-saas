const knex = require('../config/db');

exports.createSubscription = async (data) => {
    /**
     * INSERT INTO subsciptions ()
     * VALUES()
     */
    const result = await knex('subscriptions').insert(data).returning('*');
    return result;
};

exports.getExpiredTrials = async () => {
    /**
     * SELECT id
     * FROM
     * WHERE trial_end_date < now()
     */
    const result = await knex('subscriptions')
        .select('id', 'billing_frequency', 'customer_id')
        .where('status', 'trial')
        .andWhere('trial_end_date', '<=', new Date())
        .andWhere('auto_renew', true);
    return result;
};

exports.patchSubscription = async (id, data) => {
    const result = await knex('subscriptions')
        .where({ id })
        .patch({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning('*');
    return result;
};

exports.getAllSubscriptionsByCustomerId = async (customerId) => {
    const result = await knex('subscriptions').where('customer_id', customerId).select('*');
    return result;
};

exports.getSubscriptionById = async (id) => {
    const result = await knex('subscriptions').where('id', id).select('*');
    return result;
};

exports.createSubscriptionChange = async (data) => {
    const result = await knex('subscription_changes').insert(data).returning('*');
    return result;
};
