const db = require('../config/connection')
const admin = db.admin

const isVendor = (req,res,next) => {

    admin.findByPk(req.userId).then((admin) => {
        if(admin && admin.roleId === 3){
            next();
            return;
        }
        res.status(403).send("Vendor role required")
    })
}

module.exports = isVendor;