const express = require('express');
const customersController = require('../controllers/customers');

const router = express.Router();

router.post('/create', customersController.createCustomer);
router.get('/all', customersController.getAllCustomers);

module.exports = router;
