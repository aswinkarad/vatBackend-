const db = require("../../config/connection")
const client  = db.client
const bcrypt = require('bcrypt')
require("../../middleware/auth")
const jwtConfig = require('../../config/jwt');
const jwt = require('../../utils/jwt');
const config = process.env
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')


const createAdmin = async (req,res) => {
    const adminid = await client.findOne({
        where: {email: req.body.email}
    })

    if(adminid){
        return res.status(400).send("email already exist!")
    }

    const password = await bcrypt.hash(req.body.password, 8)

    const create = await client.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
        mobile: req.body.mobile
    })
    if (create) {
        return res.status(200).send("client created successfully")
    } else {
        return res.status(400).send("client not created")
    }

   
}

const loginAdmin = async (req,res) => {

  const { name, password } = req.body;


    await client.findOne({
        where: {name: req.body.name}
    }).then(async client => {
        if (!client) {
            return res.status(404).send({
                    response: "failed",
                    message: "Invalid name or password"
            })
        }
        var passwordIsValid = bcrypt.compareSync(
            password,
            client.password
        )
        if (passwordIsValid){
            const token = jwt.createToken({ id: client.id, }, config.JWT_SECRET, {
                expiresIn: jwtConfig.ttl,
            });
            res.status(200).json({
                status: 'success',
                data: {
                    id: client.id,
                    name: client.name,
                    mobile: client.mobile,
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

    const adminid = await client.findOne({
        where: {id: req.params.id}
    }) 

    if(!adminid){
        return res.status(400).send("client not found")
    }

    const password = await bcrypt.hash(req.body.password, 8)

    const update = await client.update({
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

    const adminid = await client.findOne({
        where: {id: req.params.id}
    }) 

    if(!adminid){
        return  res.status(400).send("Admin not found")
    }
    
    const Delete = await client.destroy({
        where: {id: req.params.id}
    })

    if (Delete) {
        return res.status(200).send("Admin is deleted")
    } else {
        return res.status(400).send("Admin is not deleted")
    }

}

const readAdmin = async (req,res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {
        //    clientId: req.userId
        },
        // include:[
        //     {
        //         model: client,
        //     }

        // ],
        limit, offset,
        order: [['createdAt', 'DESC']] ,
    }
    if (id) {
        option.where.id = id
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` }
    }
    await client.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })
}
const ListAllAdmin = async (req,res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {
         
        },
       
        limit, offset,
        order: [['createdAt', 'DESC']] ,
    }
    if (id) {
        option.where.id = id
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` }
    }
    await client.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })
}

const authCheck = async (req, res) => {


    res.send({
        response: 'success',
        auth: true,
        user: req.user
  
    })
  }

module.exports = {
    createAdmin,
    loginAdmin,
    updateAdmin,
    deleteAdmin,
    readAdmin,
    authCheck,
    ListAllAdmin
}