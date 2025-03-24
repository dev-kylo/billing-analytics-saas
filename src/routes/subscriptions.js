const express = require('express');
const subscriptionsController = require('../controllers/subscriptions');
const validateCustomerExists = require('../middlewares/validateCustomerExists');

const router = express.Router();

router.post('/', validateCustomerExists, subscriptionsController.createSubscription);
router.get('/', validateCustomerExists, subscriptionsController.getAllSubscriptions);
router.get('/:id', subscriptionsController.getSubscription);
router.patch('/:id', subscriptionsController.patchSubscription);

module.exports = router;
