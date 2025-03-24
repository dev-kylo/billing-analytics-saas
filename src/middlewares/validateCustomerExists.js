const customerModel = require('../models/customer');
const AppError = require('../utils/AppError');

module.exports = async function validateCustomerExists(req, res, next) {
    try {
        const customerId = req.body.customerId || req.params.customerId || req.query.customerId;
        if (!customerId) {
            throw new AppError('customerId is required', 400);
        }

        const customer = await customerModel.getCustomer(customerId);
        if (!customer) {
            throw new AppError(`Customer with ID ${customerId} not found`, 404);
        }

        // Optionally attach the customer to the request for later use
        req.customer = customer;

        next();
    } catch (err) {
        next(err);
    }
};
