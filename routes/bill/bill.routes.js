const express = require('express');
const router = express.Router();
const controller = require('./bill.controller')
const auth = require('../../middleware/auth')
const path = require('path')
const multer  = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },    
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: storage
})


router.post('/bill/create', upload.single('image'), controller.createBill);
router.put('/bill/update/:id', upload.single('image'), controller.updateBill); 
router.delete('/bill/delete/:id', controller.deleteBill);
router.get('/bill/read', controller.readBill);

module.exports = router;