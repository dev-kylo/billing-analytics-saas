const express = require('express');
const customersController = require('../controllers/customers');

const router = express.Router();

router.post('/', customersController.createCustomer);
router.get('/', customersController.getAllCustomers);
router.get('/:id', customersController.getCustomer);
router.put('/:id', customersController.updateCustomer);
router.patch('/:id', customersController.patchCustomer);

module.exports = router;
