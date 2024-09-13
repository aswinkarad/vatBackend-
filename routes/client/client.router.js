const express = require('express');
const router = express.Router();
const { validateBody } = require('../../middleware/validator');
const { schemas } = require('../../middleware/validator');
const controller = require('./client.controller');
// const isadmin = require('../../middleware/isadmin')
const auth = require('../../middleware/auth')

router.post('/client/create', validateBody(schemas.CreateSchema), controller.createAdmin);
router.post('/client/login', controller.loginAdmin);
router.put('/client/update/:id', controller.updateAdmin);
router.delete('/client/delete/:id', controller.deleteAdmin);
router.get('/client/read',  controller.readAdmin);
router.get('/client/authCheck', controller.authCheck);
router.get('/client/AllAdminList', controller.ListAllAdmin);

module.exports = router