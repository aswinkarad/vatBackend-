const db = require('../config/connection')
const admin = db.admin

const isAdmin = (req,res,next) => {

    admin.findByPk(req.userId).then((admin) => {
        if(admin && admin.roleId === 1){
            next();
            return;
        }
        res.status(403).send("admin role required")
    })
}

module.exports = isAdmin;