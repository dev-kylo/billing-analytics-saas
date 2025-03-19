const express = require('express');
const customerRoutes = require('./customer');
const authRoutes = require('./auth');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);

module.exports = router;
