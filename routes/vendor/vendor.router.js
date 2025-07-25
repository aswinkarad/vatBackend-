

// const express = require('express');
// const router = express.Router();
// const controller = require('./vendor.controller');

// // Create a new vendor
// router.post('/vendor/create', controller.createVendor);

// // Update an existing vendor (edit)
// router.put('/vendor/update/:id', controller.updateVendor);

// // Delete a vendor
// router.delete('/vendor/delete/:id', controller.deleteVendor);

// // (Optional) Get a list of vendors
// router.get('/vendor/list', controller.vendorList);

// // (Optional) Get details of a specific vendor by id
// // router.get('/vendor/read/:id', controller.readVendor);

// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('./vendor.controller');

// Create a new vendor
router.post('/vendor/create', controller.createVendor);

// Update an existing vendor (edit)
router.put('/vendor/update/:id', controller.updateVendor);

// Delete a vendor
router.delete('/vendor/delete/:id', controller.deleteVendor);

// Get a list of vendors
router.get('/vendor/list', controller.vendorList);



module.exports = router;

