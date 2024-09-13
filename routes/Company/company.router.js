const express = require('express');
const router = express.Router();
const { validateBody } = require('../../middleware/validator');
const { schemas } = require('../../middleware/validator');
const controller = require('./company.controller');


router.post('/company/create', controller.createCustomer);
router.put('/company/update/:id', controller.updateCustomer);
router.delete('/company/delete/:id', controller.deleteCustomer,);
router.get('/company/read',  controller.CustomerList);
router.get('/company/listByClient', controller.CustomerListByClient);
router.get('/companies/client/:clientId', controller.CompanyBYClientId);

module.exports = router