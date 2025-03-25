const express = require('express');
const customerRoutes = require('./customers');
const authRoutes = require('./auth');
const subscriptionRoutes = require('./subscriptions');
const invoiceRoutes = require('./invoices');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;
