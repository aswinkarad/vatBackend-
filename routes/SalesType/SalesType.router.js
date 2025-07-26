const express = require('express');
const router = express.Router();
const controller = require('./SalesType.controller');

// Create a new SaleType
router.post('/SaleType/create', controller.createSaleType);

// Update an existing SaleType (edit)
router.put('/SaleType/update/:id', controller.updateSaleType);

// Delete a SaleType
router.delete('/SaleType/delete/:id', controller.deleteSaleType);

// Get a list of SaleTypes
router.get('/SaleType/list', controller.SaleTypeList);



module.exports = router;