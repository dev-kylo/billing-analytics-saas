const knex = require('../config/db');

exports.createInvoice = async (invoiceData) => {
    const result = await knex('invoices').insert(invoiceData).returning('*');
    return result;
};

exports.getInvoice = async (id) => {
    const result = await knex('invoices').where('id', id).first();
    return result;
};

exports.updateInvoice = async (id, invoiceData) => {
    const result = await knex('invoices').where('id', id).update(invoiceData).returning('*');
    return result;
};

exports.deleteInvoice = async (id) => {
    const result = await knex('invoices').where('id', id).delete();
    return result;
};

exports.patchInvoice = async (id, invoiceData) => {
    const result = await knex('invoices').where('id', id).patch(invoiceData).returning('*');
    return result;
};
