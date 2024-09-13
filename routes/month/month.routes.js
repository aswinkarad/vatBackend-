const express = require('express');
const router = express.Router();
const controller = require('./month.controller');

router.post('/month/create', controller.createMonth);
router.post('/month/bulkCreate', controller.BulkcreateMonth);
router.put('/month/update/:id', controller.updateMonth);
router.delete('/month/delete/:id', controller.deleteMonth);
router.get('/month/read', controller.readMonth);

module.exports = router 