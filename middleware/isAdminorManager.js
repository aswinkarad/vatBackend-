const db = require("../config/connection");
const admin = db.admin;
const staff = db.staff;


const isAdminorisManager = async (req,res,next) => {
    try {

      const Admin = await admin.findByPk(req.userId)
    //   const Staff =  await staff.findByPk(req.userId)

          if (Admin && Admin.roleId === 1) {
            next();

        } else if(Admin && Admin.roleId === 2){
            next();
        }else{
          res.status(403).send("Unautharised Access")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
    
}

module.exports = isAdminorisManager