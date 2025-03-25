const service = require('../services/invoiceService');
const AppError = require('../utils/AppError');

/**
 * Handles creating a customer
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.createInvoice = async (req, res, next) => {
    try {
        if (!req.subscription) throw new AppError('Subscription not found', 400);
        if (!req.customer) throw new AppError('Customer not found', 400);

        const result = await service.createInvoice(req.body, req.subscription, req.customer);
        res.status(202).json(result);
    } catch (e) {
        next(e);
    }
};

/**
 * Get all invoices for a customer
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getCustomerInvoices = async (req, res, next) => {
    if (!req.customer) throw new AppError('Customer not found', 400);
    const result = await service.getCustomerInvoices(req.customer);
    res.status(200).json(result);
};

exports.getInvoice = async (req, res, next) => {
    if (!req.invoice) throw new AppError('Invoice not found', 400);
    res.status(200).json(req.invoice);
};

exports.updateInvoice = async (req, res, next) => {
    if (!req.invoice) throw new AppError('Invoice not found', 400);
    const result = await service.updateInvoice(req.invoice, req.body);
    res.status(200).json(result);
};

exports.deleteInvoice = async (req, res, next) => {
    if (!req.invoice) throw new AppError('Invoice not found', 400);
    const result = await service.deleteInvoice(req.invoice);
    res.status(200).json(result);
};
