const db = require("../../config/connection")
const admin  = db.admin
const bcrypt = require('bcrypt')
require("../../middleware/auth")
const jwtConfig = require('../../config/jwt');
const jwt = require('../../utils/jwt');
const config = process.env
const { Op } = require("sequelize");


const createAdmin = async (req,res) => {
    const adminid = await admin.findOne({
        where: {email: req.body.email}
    })

    if(adminid){
        return res.status(400).send("email already exist!")
    }

    const password = await bcrypt.hash(req.body.password, 8)

    const create = await admin.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
        mobile: req.body.mobile
    })
    if (create) {
        return res.status(200).send("admin created successfully")
    } else {
        return res.status(400).send("admin not created")
    }

   
}

const loginAdmin = async (req,res) => {

  const { name, password } = req.body;


    await admin.findOne({
        where: {name: req.body.name}
    }).then(async admin => {
        if (!admin) {
            return res.status(404).send({
                    response: "failed",
                    message: "Invalid name or password"
            })
        }
        var passwordIsValid = bcrypt.compareSync(
            password,
            admin.password
        )
        if (passwordIsValid){
            const token = jwt.createToken({ id: admin.id, }, config.JWT_SECRET, {
                expiresIn: jwtConfig.ttl,
            });
            res.status(200).json({
                status: 'success',
                data: {
                    id: admin.id,
                    name: admin.name,
                    mobile: admin.mobile,
                    token: token}
                })        
        }else{
            return res.status(400).send({
                response: "failed",
                message: "Invalid login"
            })
        }
    })
}    

const updateAdmin = async (req,res) => {

    const adminid = await admin.findOne({
        where: {id: req.params.id}
    }) 

    if(!adminid){
        return res.status(400).send("admin not found")
    }

    const password = await bcrypt.hash(req.body.password, 8)

    const update = await admin.update({
        name: req.body.name,
        mobile: req.body.mobile,
        password: password,
        email: req.body.email

    },{
        where: {id: req.params.id}
    })

    if (update) {
        return res.status(200).send("email is updated")
    } else {
        return res.status(400).send("email not updated")
    }
}

const deleteAdmin = async (req,res) => {

    const adminid = await admin.findOne({
        where: {id: req.params.id}
    }) 

    if(!adminid){
        return  res.status(400).send("Admin not found")
    }
    
    const Delete = await admin.destroy({
        where: {id: req.params.id}
    })

    if (Delete) {
        return res.status(200).send("Admin is deleted")
    } else {
        return res.status(400).send("Admin is not deleted")
    }

}

const readAdmin = async (req,res) => {
    try {
        const getPagination = (page, size) => {
            const limit = size ? +size : 16
            const offset = page ? page * limit: 0
        
            return {limit, offset}
          }
    
          const getPagingData = (data, page, limit) => {
            const {count: totalItems, rows: admin} = data
            const currentPage = page ? +page: 0
            const totalPages = Math.ceil(totalItems / limit)
       
            return {totalItems, admin, totalPages, currentPage}
         }
    
       const {page, size, title, id} = req.query

       const condition = {
        [Op.and]:
         [title ? {title: {[Op.like]: `%${title}%`}} : null , id ? {id: id} : null].filter(Boolean)
       }

       const {limit, offset} = getPagination(page, size)
      
       const data = await admin.findAndCountAll({
        attributes: { exclude: ['createdAt',  'updatedAt']},
        where: condition, limit, offset
       })

       const response = getPagingData(data, page, limit)
       res.send(response)
       
     
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
}

const authCheck = async (req, res) => {


    res.send({
        response: 'success',
        auth: true,
        user: req.user
  
    })
  }

  const logOut = async (req, res) => {
    const token = req.token;
    const now = new Date();
    const expire = new Date(req.user.exp);
    const milliseconds = now.getTime() - expire.getTime();
    /* -- BlackList Token -- */
    await cache.set(token, token, milliseconds);
    return res.send({ response: "success", message: 'Logged out successfully' });
  }
  
  const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i]
          });
          return;
        }
      }
    }
  
    next();
  };
module.exports = {
    createAdmin,
    loginAdmin,
    updateAdmin,
    deleteAdmin,
    readAdmin,
    authCheck,
    logOut
}