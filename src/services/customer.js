const knex = require('../config/db'); // Import your Knex instance

exports.getAllCustomers = () => knex('customers').select('*');

exports.createCustomer = async (firstname, surname, email) => {
    /**
     * INSERT INTO customers (firstname, lastname)
     * VALUES (first, last)
     */

    const result = await knex('customers').insert({ firstname, surname, email }).returning('*');
    return result;
};
