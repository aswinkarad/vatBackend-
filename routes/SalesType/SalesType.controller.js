const db = require("../../config/connection")
const sale_type = db.sale_type
require("../../middleware/auth")
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')


const createSaleType = async (req, res) => {

  const create = await sale_type.create({
    saletype: req.body.saletype,
    clientId: req.userId,
    
  })
  if (create) {
    return res.status(200).send("sale_type created successfully")
  } else {
    return res.status(400).send("sale_type not created")
  }
}


const updateSaleType = async (req, res) => {

  const adminid = await sale_type.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("SaleType not found")
  }


  const update = await sale_type.update({
    saletype: req.body.saletype,
    

  }, {
    where: { id: req.params.id }
  })

  if (update) {
    return res.status(200).send("email is updated")
  } else {
    return res.status(400).send("email not updated")
  }
}

const deleteSaleType = async (req, res) => {

  const adminid = await sale_type.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("sale_type not found")
  }

  const Delete = await sale_type.destroy({
    where: { id: req.params.id }
  })

  if (Delete) {
    return res.status(200).send("sale_type is deleted")
  } else {
    return res.status(400).send("sale_type is not deleted")
  }

}

const SaleTypeList = async (req, res) => {
  const { page, size, id, name } = req.query;
  const { limit, offset } = pg.getPagination(page, size);
  const option = {
    where: {

    },
    include: [
      {
        model: client,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }

    ],

    limit, offset,
    order: [['createdAt', 'DESC']],
  }
  if (id) {
    option.where.id = id
  }
  if (name) {
    option.where.name = { [Op.like]: `%${name}%` }
  }
  await sale_type.findAndCountAll(option).then((result) => {
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
  createSaleType,
  updateSaleType,
  deleteSaleType,
  SaleTypeList,
  
}