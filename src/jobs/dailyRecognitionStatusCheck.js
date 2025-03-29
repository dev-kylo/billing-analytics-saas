// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('node-cron');
const revenueRecognitionModel = require('../models/revenueRecognition');

console.log('⏰ Registering cron for daily recognition status check...');
cron.schedule('0 3 * * *', async () => {
    try {
        await revenueRecognitionModel.updateRecognitionStatus();
    } catch (error) {
        console.error('Error updating recognition status:', error);
    }
});
