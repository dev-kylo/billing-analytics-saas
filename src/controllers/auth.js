const { gitService } = require('../services/git');

/**
 * @module authController
 * @description Controller handling Git-related HTTP endpoints
 * @typedef {Object} authController
 * @property {WebhookHandler} handleWebhook - Handles incoming Git webhook requests
 */
const authController = {
    /**
     * Handles the Git webhook
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @returns {Promise<void>}
     * @throws {Error} When webhook processing fails
     */
    async login(req, res, next) {
         /** @type {{username: string, password: string>}} */
        const payload = req.body;

        try {
            const result = await gitService.processWebhook(payload);
            res.status(200).send(result.message)
        } catch (error) {
            console.error('Webhook processing error:', error);
            error.statusCode = 500;
            error.message = 'Failed to process webhook';
            next(error); // middleware error handler will catch this
        }
    }
};
module.exports = { authController };