const express = require('express');
const router = express.Router();
const controller = require('./date.controller');


router.post('/dates/create',  controller.createDate);

router.post('/dates/bulkCreate', controller.BulkcreateDate);

router.put('/dates/update/:id', controller.updateDate);

router.delete('/dates/delete/:id', controller.deleteDate);

router.get('/dates/read', controller.readDate);

module.exports = router 