const knex = require('../config/db');
const { addMonths, billingFrequencyToMonths } = require('../utils/helpers');
const model = require('../models/invoice');
const revenueRecognitionService = require('./revenueRecognitionService');

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

    const invoiceEntry = await model.createInvoice(invoice);

    await revenueRecognitionService.generateRecognitionForSubscription(subscription, invoiceEntry.id);

    // We should actually create a knex transaction tying the invoice and the revenue recognition entries together
    // so that we can roll back the invoice if the revenue recognition entries fail

    return invoiceEntry;
};

exports.calculateBalanceDue = async (invoice, subscription) => {
    const balanceDue = subscription.price - invoice.amount; // this will become total amount
    return balanceDue;
};

exports.createProratedInvoice = async (subscription, proratedAmount, creditAmount) => {
    const now = new Date();

    // Check if there's a invoice for the current period
    const currentPeriodPendingInvoice = await knex('invoices')
        .where({
            subscription_id: subscription.id,
            status: 'pending',
        })
        .whereBetween('period_start', [subscription.start_date, subscription.next_billing_date])
        .first();

    /**
     * If there's an unpaid invoice for the current period, we need to void it
     */
    if (currentPeriodPendingInvoice) {
        await model.patchInvoice(currentPeriodPendingInvoice.id, { status: 'void' });
    }

    const invoice = {
        customer_id: subscription.customer_id,
        subscription_id: subscription.id,
        amount: proratedAmount,
        credit_amount: creditAmount,
        total_amount: proratedAmount - creditAmount,
        currency: subscription.currency,
        status: 'pending',
        invoice_date: now,
        due_date: addMonths(now, 1),
        period_start: now,
        period_end: subscription.next_billing_date,
        is_prorated: true,
        previous_invoice_id: currentPeriodPendingInvoice?.id,
    };

    const invoiceEntry = await model.createInvoice(invoice);

    await revenueRecognitionService.generateRecognitionForSubscription(subscription, invoiceEntry.id);

    return invoiceEntry;
};

exports.calculateSubscriptionChangeCredit = async (subscriptionId, creditAmount) => {
    // Find the most recent paid invoice for this subscription
    const paidInvoice = await knex('invoices')
        .where({
            subscription_id: subscriptionId,
            status: 'paid',
        })
        .orderBy('invoice_date', 'desc')
        .first();

    if (paidInvoice) {
        // This amount should be refunded to the customer
        return {
            refundableAmount: creditAmount,
            paidInvoiceId: paidInvoice.id,
            creditStatus: 'refundable',
        };
    }

    // If no paid invoice exists, this amount should be credited to the next invoice
    return {
        refundableAmount: 0,
        creditStatus: 'pending',
    };
};
