const model = require('../services/customer');
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
            throw new AppError('Surname is required and must be a valid string.');
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
