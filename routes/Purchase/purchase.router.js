const express = require('express');
const router = express.Router();
const controller = require('./purchase.controller');


router.post('/purchase/create',  controller.createPurchase);

router.put('/purchase/update/:id', controller.updatePurchase);

router.delete('/purchase/delete/:id', controller.deletePurchase);

router.get('/purchase/read', controller.PurchaseList);

router.get('/purchase/listByClient', controller.PurchaseListByClient);

router.get('/purchase/TotalAmount', controller.PurchaseAmount);

module.exports = router 