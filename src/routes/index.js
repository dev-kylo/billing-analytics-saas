const express = require('express');
const customerRoutes = require('./customer.routes');
const authRoutes = require('./auth.routes')

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customer', customerRoutes);

module.exports = router;