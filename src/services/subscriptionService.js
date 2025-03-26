// subscriptionService.js
const model = require('../models/subscription');
const invoiceService = require('./invoiceService');
const { addMonths, billingFrequencyToMonths } = require('../utils/helpers');

const CHANGE_TYPES = {
    UPGRADE: 'upgrade',
    DOWNGRADE: 'downgrade',
    FREQUENCY_CHANGE: 'frequency_change',
    MIXED_CHANGE: 'mixed_change',
};

const allowedFields = [
    'price',
    'currency',
    'billing_frequency',
    'auto_renew',
    'status',
    'end_date',
    'start_date',
    'trial_end_date',
    'next_billing_date',
];

function determineChangeType(oldSubscription, newData) {
    const changes = [];

    if (newData.price !== oldSubscription.price) {
        changes.push(newData.price > oldSubscription.price ? 'upgrade' : 'downgrade');
    }

    if (newData.billing_frequency !== oldSubscription.billing_frequency) {
        changes.push('frequency_change');
    }

    if (changes.length > 1) return CHANGE_TYPES.MIXED_CHANGE;
    if (changes.length === 0) return null;

    return changes[0];
}

exports.createSubscription = async (data) => {
    const now = new Date();
    const billingFrequency = data?.billingFrequency || 'monthly';
    const autoRenew = data?.autoRenew !== false; // default to true

    const isTrial = data.isTrial === true;
    const subscription = {
        customer_id: data.customerId,
        price: data.price,
        billing_frequency: billingFrequency,
        auto_renew: autoRenew,
        currency: data.currency,
        start_date: now,
        end_date: null,
    };

    if (isTrial) {
        subscription.status = 'trial';
        subscription.trial_end_date = addMonths(now, 1);
        subscription.next_billing_date = addMonths(now, 2);
        subscription.start_date = null; // until trial ends
    } else {
        subscription.status = 'active';
        subscription.trial_end_date = null;
        subscription.next_billing_date = addMonths(now, billingFrequencyToMonths(billingFrequency));
    }

    const result = await model.createSubscription(subscription);
    return result;
};

exports.patchSubscription = async (id, data) => {
    const patchData = Object.fromEntries(Object.entries(data).filter(([key]) => allowedFields.includes(key)));
    const result = await model.patchSubscription(id, patchData);
    return result;
};

exports.convertTrialToActive = async (subscription) => {
    const months = billingFrequencyToMonths[subscription.billing_frequency] || 1;
    const nextBillingDate = addMonths(new Date(), months);

    const result = await model.patchSubscription(subscription.id, {
        status: 'active',
        start_date: new Date(),
        next_billing_date: nextBillingDate,
    });

    return result;
};

exports.recordSubscriptionChange = async (oldSubscription, newData, proratedAmount, refundAmount) => {
    const changeType = determineChangeType(oldSubscription, newData);

    if (!changeType) return null;

    const change = {
        subscription_id: oldSubscription.id,
        previous_price: oldSubscription.price,
        new_price: newData?.price || oldSubscription.price,
        previous_billing_frequency: oldSubscription.billing_frequency,
        new_billing_frequency: newData?.billing_frequency || oldSubscription.billing_frequency,
        prorated_amount: proratedAmount,
        refund_amount: refundAmount,
        change_type: changeType,
        effective_date: new Date(),
    };

    return model.createSubscriptionChange(change);
};

exports.updateSubscriptionWithProration = async (existingSubscription, newData) => {
    const now = new Date();

    // Calculate proration amounts
    const currentPeriodEnd = new Date(existingSubscription.next_billing_date);
    const totalDays = (currentPeriodEnd - existingSubscription.start_date) / (1000 * 60 * 60 * 24);
    const remainingDays = (currentPeriodEnd - now) / (1000 * 60 * 60 * 24);

    const creditAmount = (existingSubscription.price * remainingDays) / totalDays;
    const newProratedAmount = (newData.price * remainingDays) / totalDays;

    // Check if current period is paid and calculate refundable amount
    const { refundableAmount, creditStatus } = await invoiceService.calculateSubscriptionChangeCredit(
        existingSubscription.id,
        creditAmount
    );

    // Update subscription
    const patchData = Object.fromEntries(Object.entries(newData).filter(([key]) => allowedFields.includes(key)));
    const updatedSubscription = await model.patchSubscription(existingSubscription.id, {
        ...patchData,
        price: newData.price || existingSubscription.price,
        previous_price: newData.price ? existingSubscription.price : null,
        updated_at: now,
    });

    // Create prorated invoice
    const proratedInvoice = await invoiceService.createProratedInvoice(
        updatedSubscription,
        newProratedAmount,
        creditAmount
    );

    console.log('updatedSubscription With Proration', {
        subscription: updatedSubscription,
        proratedAmount: newProratedAmount,
        creditAmount,
        refundableAmount,
        creditStatus,
        proratedInvoice,
    });

    // Record the change
    return this.recordSubscriptionChange(
        existingSubscription,
        newData,
        newProratedAmount,
        creditAmount,
        refundableAmount,
        creditStatus
    );
};
