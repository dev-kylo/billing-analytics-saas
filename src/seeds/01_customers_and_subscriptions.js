// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

const BILLING_FREQUENCIES = ['monthly', 'quarterly', 'annually'];
const SUBSCRIPTION_STATUSES = ['active', 'cancelled', 'paused', 'trial'];
const SUBSCRIPTION_PLANS = ['basic', 'pro', 'enterprise'];
const CURRENCIES = ['USD', 'EUR', 'GBP'];

const PLAN_PRICES = {
    basic: {
        monthly: 9.99,
        quarterly: 24.99,
        annually: 89.99,
    },
    pro: {
        monthly: 19.99,
        quarterly: 54.99,
        annually: 199.99,
    },
    enterprise: {
        monthly: 49.99,
        quarterly: 144.99,
        annually: 499.99,
    },
};

const generateCustomers = (count) =>
    Array.from({ length: count }, () => ({
        firstname: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        created_at: faker.date.past({ years: 2 }),
        updated_at: faker.date.recent(),
    }));

const generateSubscriptions = (customerIds) =>
    customerIds.flatMap((customerId) => {
        // Generate 1-3 subscriptions per customer
        const subscriptionCount = faker.number.int({ min: 1, max: 3 });

        return Array.from({ length: subscriptionCount }, () => {
            const isTrial = faker.datatype.boolean({ probability: 0.3 });
            const startDate = faker.date.past({ years: 2 });
            const billingFrequency = faker.helpers.arrayElement(BILLING_FREQUENCIES);
            const status = faker.helpers.arrayElement(SUBSCRIPTION_STATUSES);
            const plan = faker.helpers.arrayElement(SUBSCRIPTION_PLANS);
            const currency = faker.helpers.arrayElement(CURRENCIES);
            const autoRenew = faker.datatype.boolean({ probability: 0.8 });

            // Calculate dates based on subscription type and status
            let trialStartDate = null;
            let trialEndDate = null;
            let nextBillingDate = null;
            let endDate = null;
            let cancellationDate = null;

            if (isTrial) {
                trialStartDate = startDate;
                trialEndDate = new Date(startDate);
                trialEndDate.setMonth(trialEndDate.getMonth() + 1);
                nextBillingDate = new Date(trialEndDate);
            } else {
                nextBillingDate = new Date(startDate);
                switch (billingFrequency) {
                    case 'monthly':
                        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                        break;
                    case 'quarterly':
                        nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
                        break;
                    case 'annually':
                        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                        break;
                    default:
                        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                        break;
                }
            }

            // Set end date and cancellation date for cancelled subscriptions
            if (status === 'cancelled') {
                cancellationDate = faker.date.between({ from: startDate, to: new Date() });
                endDate = new Date(cancellationDate);
                endDate.setDate(endDate.getDate() + 30); // Give 30 days notice
            }

            // Calculate price based on plan and billing frequency
            const price = PLAN_PRICES[plan][billingFrequency];

            return {
                customer_id: customerId,
                plan,
                status,
                billing_frequency: billingFrequency,
                price,
                currency,
                start_date: startDate,
                trial_start_date: trialStartDate,
                trial_end_date: trialEndDate,
                next_billing_date: nextBillingDate,
                end_date: endDate,
                cancellation_date: cancellationDate,
                auto_renew: autoRenew,
                created_at: startDate,
                updated_at: faker.date.recent(),
            };
        });
    });

exports.seed = async function (db) {
    // First, clean up existing data
    await db('subscriptions').del();
    await db('customers').del();

    // Generate 100 customers
    const customers = generateCustomers(100);
    const result = await db('customers').insert(customers).returning('id');

    const customerIds = result.map((customer) => customer.id);
    // Generate subscriptions for all customers
    const subscriptions = generateSubscriptions(customerIds);
    await db('subscriptions').insert(subscriptions);
};
