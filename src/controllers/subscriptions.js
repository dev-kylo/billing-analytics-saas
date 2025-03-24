const service = require('../services/subscriptionService');
const AppError = require('../utils/AppError');
const model = require('../models/subscription');
/**
 * Handles creating a customer
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.createSubscription = async (req, res, next) => {
    /** @type {{firstname: string, surname: string>}} */
    const { customerId, price, currency } = req.body;

    try {
        if (!customerId || !price || !currency) throw new AppError('Incorrect subscription payload', 400);
        if (!['USD', 'GBP'].includes(currency)) throw new AppError('Incorrect currency', 400);

        const result = await service.createSubscription(req.body);
        res.status(202).json(result);
    } catch (e) {
        next(e);
    }
};

/**
 * Get all subscriptions
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getAllSubscriptions = async (req, res, next) => {
    try {
        const { customerId } = req.query;
        // Ensure customerId is treated as a number if your foreign key is numeric
        const parsedId = parseInt(customerId, 10);

        if (Number.isNaN(parsedId)) {
            throw new Error('Invalid customer ID format');
        }
        const result = await model.getAllSubscriptionsByCustomerId(parsedId);
        res.status(200).json(result || []);
    } catch (e) {
        next(e);
    }
};

/**
 * Get a subscription by id
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) throw new AppError('No id provided for the subscription');
        const result = await model.getSubscriptionById(id);
        res.status(200).json(result || []);
    } catch (e) {
        next(e);
    }
};

/**
 * Handles patching a subscription
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.patchSubscription = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.params;
        if (!id) throw new AppError('No id provided for the customer');

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
        const patchData = Object.fromEntries(Object.entries(data).filter(([key]) => allowedFields.includes(key)));
        const result = await model.patchSubscription(id, patchData);
        res.status(200).json(result || []);
    } catch (e) {
        next(e);
    }
};
