const model = require('../models/customer');
const AppError = require('../utils/AppError');

/**
 * Handles creating a customer
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.createCustomer = async (req, res, next) => {
    /** @type {{firstname: string, surname: string>}} */
    const { firstname, surname, email } = req.body;

    try {
        // 🔹 1️⃣ Validate input
        if (!firstname || typeof firstname !== 'string' || firstname.trim() === '') {
            throw new AppError('Firstname is required and must be a valid string.', 400);
        }

        if (!surname || typeof surname !== 'string' || surname.trim() === '') {
            throw new AppError('Surname is required and must be a valid string.', 400);
        }

        if (!email || typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
            throw new AppError('Email is missing or invalid', 400);
        }

        // 🔹 2️⃣ Trim input to remove leading/trailing spaces
        const trimmedFirstname = firstname.trim();
        const trimmedSurname = surname.trim();

        const result = await model.createCustomer(trimmedFirstname, trimmedSurname, email);
        res.status(202).json(result);
    } catch (e) {
        next(e); //
    }
};

/**
 * Handles fetching all customers
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getAllCustomers = async (req, res, next) => {
    try {
        const result = await model.getAllCustomers();
        res.status(200).json(result || []);
    } catch (e) {
        next(e);
    }
};

/**
 * Handles fetching a customer
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) throw new AppError('No id provided for the customer');
        const result = await model.getCustomer(id);
        if (!result || !result[0]) throw new AppError(`Customer with id ${id} not found.`, 404);
        res.status(200).json(result[0]);
    } catch (e) {
        next(e);
    }
};

/**
 * Handles updating the customers
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.updateCustomer = async (req, res, next) => {
    try {
        /** @type {{firstname: string, surname: string>}} */
        const { firstname, surname, email } = req.body;
        const { id } = req.params;
        // 🔹 1️⃣ Validate input
        if (!firstname || typeof firstname !== 'string' || firstname.trim() === '') {
            throw new AppError('Firstname is required and must be a valid string.', 400);
        }

        if (!surname || typeof surname !== 'string' || surname.trim() === '') {
            throw new AppError('Surname is required and must be a valid string.');
        }

        if (!email || typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
            throw new AppError('Email is missing or invalid', 400);
        }
        const result = await model.updateCustomer(id, req.body);
        res.status(200).json(result || []);
    } catch (e) {
        next(e);
    }
};

/**
 * Handles patching a customer
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.patchCustomer = async (req, res, next) => {
    try {
        /** @type {{firstname?: string, surname?: string, email?: string}} */
        const data = req.body;
        const { id } = req.params;
        if (!id) throw new AppError('No id provided for the customer');

        const allowedFields = ['email', 'firstname', 'surname'];
        const patchData = Object.fromEntries(Object.entries(data).filter(([key]) => allowedFields.includes(key)));
        const result = await model.patchCustomer(id, patchData);
        res.status(200).json(result || []);
    } catch (e) {
        next(e);
    }
};
