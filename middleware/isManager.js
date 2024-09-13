const db = require('../config/connection')
const admin = db.admin

const isManager = (req,res,next) => {

    admin.findByPk(req.userId).then((admin) => {
        if(admin && admin.roleId === 2){
            next();
            return;
        }
        res.status(403).send("Manager role required")
    })
}

module.exports = isManager;