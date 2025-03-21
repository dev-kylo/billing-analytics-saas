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
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning('*');
    return result;
};
