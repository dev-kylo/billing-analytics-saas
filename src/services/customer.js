const knex = require('../config/db'); // Import your Knex instance

exports.getAllCustomers = () => knex('customers').select('*');

exports.getCustomer = (id) => knex('customers').select('*').where({ id });

exports.createCustomer = async (firstname, surname, email) => {
    /**
     * INSERT INTO customers (firstname, lastname)
     * VALUES (first, last)
     */

    const result = await knex('customers').insert({ firstname, surname, email }).returning('*');
    return result;
};

exports.updateCustomer = async (id, data) => {
    // UPDATE customers
    // UPDATE customers
    // SET email=data.email, firstname=data.email, surname=data.email
    // WHERE id=id

    const result = await knex('customers')
        .where({ id })
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning('*');
    return result;
};

exports.patchCustomer = async (id, data) => {
    const result = await knex('customers')
        .where({ id })
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning('*');
    return result;
};
