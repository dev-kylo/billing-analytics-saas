/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
const { addMonths, format } = require('../utils/helpers');
const recognitionModel = require('../models/revenueRecognition');

const frequencyToPeriods = {
    monthly: 1,
    quarterly: 3,
    annually: 12,
};

/**
 * Generates revenue recognition entries for a subscription invoice
 * @param {Object} subscription - The subscription object
 * @param {number} subscription.id - Subscription ID
 * @param {number} subscription.price - Subscription price amount
 * @param {('monthly'|'quarterly'|'annually')} subscription.billing_frequency - The billing frequency
 * @param {string} subscription.currency - Three-letter currency code
 * @param {string} subscription.start_date - Subscription start date (YYYY-MM-DD)
 * @param {string} subscription.end_date - Subscription end date (YYYY-MM-DD)
 * @param {number|null} invoiceId - The ID of the invoice (optional)
 * @param {('daily'|'subscription-based')} [recognitionPeriod='daily'] - How to split the recognition periods
 * @returns {Promise<Array>} Array of created revenue recognition entries
 */

// gets called at the time of invoice creation
// recognitionPerdiod can be 'daily', or "subscription-based
exports.generateRecognitionForSubscription = async (subscription, invoiceId, recognitionPeriod = 'daily') => {
    const {
        id: subscriptionId,
        price,
        billing_frequency: billingFrequency,
        currency,
        start_date: startDate,
        end_date: endDate,
    } = subscription;

    const totalAmount = parseFloat(price); // totalAmount: The full amount to be recognized
    const start = new Date(startDate);
    const end = new Date(endDate);

    const entries = [];
    if (recognitionPeriod === 'daily') {
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const dailyAmountRaw = totalAmount / totalDays;
        let accumulated = 0; // Used later to make sure the last entry fills in any rounding gap

        for (let i = 0; i < totalDays - 1; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i); // move the date forward by i days

            const amount = parseFloat(dailyAmountRaw.toFixed(2));
            accumulated += amount;

            entries.push({
                invoice_id: invoiceId || null,
                subscription_id: subscriptionId,
                amount,
                recognition_start_date: format(current, 'yyyy-MM-dd'),
                recognition_end_date: format(current, 'yyyy-MM-dd'),
                currency,
                status: 'pending',
            });
        }

        // Final day: fix rounding
        const finalAmount = parseFloat((totalAmount - accumulated).toFixed(2));
        const finalDate = new Date(start);
        finalDate.setDate(start.getDate() + totalDays - 1);

        entries.push({
            invoice_id: invoiceId || null,
            subscription_id: subscriptionId,
            amount: finalAmount,
            recognition_start_date: format(finalDate, 'yyyy-MM-dd'),
            recognition_end_date: format(finalDate, 'yyyy-MM-dd'),
            currency,
            status: 'pending',
        });
    } else if (recognitionPeriod === 'subscription-based') {
        // intervalMonths: How many months each recognition period spans
        // totalPeriods: How many periods to split the amount into
        // Example (monthly plan, 1 year):
        // 31,536,000,000 ms ÷ 2,592,000,000 ms = ~12.17 → floor → 12 periods
        // Math.floor to round down to avoid creating extra revenue entries that go beyond the end date.
        const intervalMonths = frequencyToPeriods[billingFrequency] || 1;
        const millisecondsInOneRecognitionPeriod = 1000 * 60 * 60 * 24 * 30 * intervalMonths;
        const totalRecognitionPeriods = Math.floor(
            (end.getTime() - start.getTime()) / millisecondsInOneRecognitionPeriod
        );

        let current = new Date(start);
        let accumulated = 0;

        for (let i = 0; i < totalRecognitionPeriods - 1; i++) {
            const periodStart = new Date(current);
            const periodEnd = addMonths(periodStart, intervalMonths);
            const amount = parseFloat((totalAmount / totalRecognitionPeriods).toFixed(2));
            accumulated += amount;

            entries.push({
                invoice_id: invoiceId || null,
                subscription_id: subscriptionId,
                amount,
                recognition_start_date: format(periodStart, 'yyyy-MM-dd'),
                recognition_end_date: format(periodEnd, 'yyyy-MM-dd'),
                currency,
                status: 'pending',
            });

            current = periodEnd;
        }

        // Final entry to adjust rounding
        const finalAmount = parseFloat((totalAmount - accumulated).toFixed(2));

        entries.push({
            invoice_id: invoiceId || null,
            subscription_id: subscriptionId,
            amount: finalAmount,
            recognition_start_date: format(current, 'yyyy-MM-dd'),
            recognition_end_date: format(end, 'yyyy-MM-dd'),
            currency,
            status: 'pending',
        });
    }

    return recognitionModel.createRecognitionEntries(entries);
};

exports.getSubscriptionRecognitionEntries = async (id, status, start, end) => {
    const entries = await recognitionModel.getBySubscription(id, {
        status,
        start,
        end,
    });

    const summary = await recognitionModel.getSubscriptionSummary(id, {
        status,
        start,
        end,
    });

    return { entries, summary };
};
