const express = require('express');
const router = express.Router();
const { validateBody } = require('../../middleware/validator');
const { schemas } = require('../../middleware/validator');
const controller = require('./admin.controller');


router.post('/admin/create', validateBody(schemas.CreateSchema), controller.createAdmin);
router.post('/admin/login', controller.loginAdmin);
router.put('/admin/update/:id', controller.updateAdmin);
router.delete('/admin/delete/:id', controller.deleteAdmin);
router.get('/admin/read',  controller.readAdmin);
router.get('/admin/authCheck', controller.authCheck);
router.get('/user/log_out', controller.logOut);

module.exports = router