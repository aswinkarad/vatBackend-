const db = require("../../config/connection")
const client  = db.client
const company = db.company
require("../../middleware/auth")

const { Op } = require("sequelize");
const pg = require('../../utils/pagination')


const createCustomer = async (req,res) => {

    const create = await company.create({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        location: req.body.location,
        clientId : req.body.clientId,
        ved: req.body.ved 
    })
    if (create) {
        return res.status(200).send("company created successfully")
    } else {
        return res.status(400).send("company not created")
    }
}


const updateCustomer = async (req,res) => {

    const adminid = await company.findOne({
        where: {id: req.params.id}
    }) 

    if(!adminid){
        return res.status(400).send("company not found")
    }


    const update = await company.update({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        location: req.body.location,
        clientId : req.body.clientId,
        ved: req.body.ved

    },{
        where: {id: req.params.id}
    })

    if (update) {
        return res.status(200).send("email is updated")
    } else {
        return res.status(400).send("email not updated")
    }
}

const deleteCustomer = async (req,res) => {

    const adminid = await company.findOne({
        where: {id: req.params.id}
    }) 

    if(!adminid){
        return  res.status(400).send("company not found")
    }
    
    const Delete = await company.destroy({
        where: {id: req.params.id}
    })

    if (Delete) {
        return res.status(200).send("company is deleted")
    } else {
        return res.status(400).send("company is not deleted")
    }

}

const CustomerList = async (req, res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {
           
        },
        include:[
            {
                model: client,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            }

        ],
       
        limit, offset,
        order: [['createdAt', 'DESC']] ,
    }
    if (id) {
        option.where.id = id
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` }
    }
    await company.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })

}
const CustomerListByClient = async (req, res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {
           clientId: req.userId
        },
        include:[
            {
                model: client,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            }

        ],
       
        limit, offset,
        order: [['createdAt', 'DESC']] ,
    }
    if (id) {
        option.where.id = id
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` }
    }
    await company.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })

}

const CompanyBYClientId = async (req, res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: { clientId: req.params.clientId  },
        include:[
            {
                model: client,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            }

        ],
       
        limit, offset,
        order: [['createdAt', 'DESC']] ,
    }
    if (id) {
        option.where.id = id
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` }
    }
    await company.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })

}

module.exports = {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    CustomerList,
    CustomerListByClient,
    CompanyBYClientId
}