const knex = require('../config/db');
const { addMonths, billingFrequencyToMonths } = require('../utils/helpers');
const model = require('../models/invoice');

exports.createInvoice = async (invoiceData, subscription) => {
    const { currency } = invoiceData;

    const invoiceAmount = subscription.price; // use subscription price if no price is provided
    const selectedCurrency = currency || subscription.currency;

    const previousInvoice = await knex('invoices')
        .where('subscription_id', subscription.id)
        .orderBy('invoice_date', 'desc')
        .first();

    let startDate;
    if (!previousInvoice) {
        if (subscription.trial_period) {
            // if there is a trial period, we start the invoice from the trial end date
            startDate = subscription.trial_end_date;
        } else {
            startDate = subscription.start_date;
        }
    } else {
        startDate = previousInvoice.period_end;
    }

    const endDate = addMonths(startDate, billingFrequencyToMonths(subscription.billing_frequency));

    const invoice = {
        customer_id: subscription.customer_id,
        subscription_id: subscription.id,
        amount: invoiceAmount,
        currency: selectedCurrency,
        status: 'pending',
        invoice_date: new Date(),
        due_date: addMonths(new Date(), 1), // 30 days from now
        period_start: startDate,
        period_end: endDate,
    };

    // extra work to be done here
    // if the amount is less than the subscription price, then we should have a 'total amount' which begins
    // with the subscription price and then we subtract the amount from it

    const result = await model.createInvoice(invoice);

    return result;
};

exports.calculateBalanceDue = async (invoice, subscription) => {
    const balanceDue = subscription.price - invoice.amount; // this will become total amount
    return balanceDue;
};
