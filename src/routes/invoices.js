const express = require('express');
const invoicesController = require('../controllers/invoices');
const validateCustomerExists = require('../middlewares/validateCustomerExists');
const validateSubscriptionExists = require('../middlewares/validateSubscriptionExists');
const validateInvoiceExists = require('../middlewares/validateInvoiceExists');

const router = express.Router();

router.post('/', validateCustomerExists, validateSubscriptionExists, invoicesController.createInvoice);
router.get('/', validateCustomerExists, invoicesController.getInvoice);
router.patch('/:id', validateInvoiceExists, invoicesController.patchInvoice);
router.delete('/:id', validateInvoiceExists, invoicesController.deleteInvoice);

module.exports = router;
