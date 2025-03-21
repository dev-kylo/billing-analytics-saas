// subscriptionService.js
const model = require('../models/subscription');
const { addMonths, billingFrequencyToMonths } = require('../utils/helpers');

exports.createSubscription = async (data) => {
    // if isTrial false,
    //  set next billiing date according to billingFrequency
    // set status to active
    // If isTrial true,
    // set end trial date 1 month later, and next billing dater after that
    //  set status to trial

    // autoRenew is default true
    // endDate can be null, startDate null also if isTrial
    // billingFrequency defaults to month

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
