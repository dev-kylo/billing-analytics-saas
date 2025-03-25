const invoiceModel = require('../models/invoice');
const AppError = require('../utils/AppError');

module.exports = async function validateCustomerExists(req, res, next) {
    try {
        const invoiceId = req.body.invoiceId || req.params.invoiceId || req.query.invoiceId;
        if (!invoiceId) {
            throw new AppError('invoiceId is required', 400);
        }

        const invoice = await invoiceModel.getInvoice(invoiceId);
        if (!invoice) {
            throw new AppError(`Invoice with ID ${invoiceId} not found`, 404);
        }

        // Optionally attach the subscription to the request for later use
        req.invoice = invoice;

        next();
    } catch (err) {
        next(err);
    }
};
