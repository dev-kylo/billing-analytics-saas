// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('node-cron');
const subscriptionModel = require('../models/subscription');
const subscriptionService = require('../services/subscriptionService');

console.log('⏰ Registering cron for expired trials...');
cron.schedule('0 3 * * *', async () => {
    console.log('⏰ Checking for expired trials...');
    const expiredTrials = await subscriptionModel.getExpiredTrials();

    for (const sub of expiredTrials) {
        await subscriptionService.convertTrialToActive(sub);
    }
});
