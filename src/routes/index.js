const express = require('express');
const customerRoutes = require('./customers');
const authRoutes = require('./auth');
const subscriptionRoutes = require('./subscriptions');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/subscriptions', subscriptionRoutes);

module.exports = router;
