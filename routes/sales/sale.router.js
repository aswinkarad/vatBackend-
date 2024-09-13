const express = require('express');
const router = express.Router();
const controller = require('./sale.controller');


router.post('/Sale/create',  controller.createSale);

router.put('/Sale/update/:id', controller.updateSale);

router.delete('/Sale/delete/:id', controller.deleteSale);

router.get('/Sale/read', controller.SaleList);

router.get('/Sale/ListByClient', controller.SaleListByClient);

router.get('/Sale/TotalAmount', controller.SaleAmount);

module.exports = router 