const subscriptionModel = require('../models/subscription');
const AppError = require('../utils/AppError');

module.exports = async function validateCustomerExists(req, res, next) {
    try {
        const subscriptionId = req.body.subscriptionId || req.params.subscriptionId || req.query.subscriptionId;
        if (!subscriptionId) {
            throw new AppError('subscriptionId is required', 400);
        }

        const subscription = await subscriptionModel.getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new AppError(`Subscription with ID ${subscriptionId} not found`, 404);
        }

        // Optionally attach the subscription to the request for later use
        req.subscription = subscription;

        next();
    } catch (err) {
        next(err);
    }
};
