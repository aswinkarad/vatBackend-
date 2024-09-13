const express = require('express');
const router = express.Router();
const controller = require('./vat.controller');


router.post('/vat/create',  controller.createvat);

router.put('/vat/update/:id', controller.updatevat);

router.delete('/vat/delete/:id', controller.deletevat);

router.get('/vat/read', controller.vatList);

router.get('/vat/listByClient', controller.vatListByClient);

router.get('/vat/TotalAmount', controller.vatAmount);

module.exports = router 