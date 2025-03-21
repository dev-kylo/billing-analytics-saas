const knex = require('../config/db');

exports.createSubscription = async (data) => {
    /**
     * INSERT INTO subsciptions ()
     * VALUES()
     */
    const result = await knex('subscriptions').insert(data).returning('*');
    return result;
};
