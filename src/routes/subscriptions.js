const express = require('express');
const subscriptionsController = require('../controllers/subscriptions');
const validateCustomerExists = require('../middlewares/validateCustomerExists');

const router = express.Router();

router.post('/', validateCustomerExists, subscriptionsController.createSubscription);
// router.get('/', subscriptionsController.getAllSubscriptions);
// router.get('/:id', subscriptionsController.getCustomer);
// router.put('/:id', subscriptionsController.updateCustomer);
// router.patch('/:id', subscriptionsController.patchCustomer);

module.exports = router;
