const db = require("../../config/connection")
const vendor = db.vendor
require("../../middleware/auth")
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')


const createVendor = async (req, res) => {

  const create = await vendor.create({
    vendor_name: req.body.vendor_name,
    clientId: req.userId,
    
  })
  if (create) {
    return res.status(200).send("vendor created successfully")
  } else {
    return res.status(400).send("vendor not created")
  }
}


const updateVendor = async (req, res) => {

  const adminid = await vendor.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("vendor not found")
  }


  const update = await vendor.update({
    vendor_name: req.body.vendor_name,
    

  }, {
    where: { id: req.params.id }
  })

  if (update) {
    return res.status(200).send("email is updated")
  } else {
    return res.status(400).send("email not updated")
  }
}

const deleteVendor = async (req, res) => {

  const adminid = await vendor.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("vendor not found")
  }

  const Delete = await vendor.destroy({
    where: { id: req.params.id }
  })

  if (Delete) {
    return res.status(200).send("vendor is deleted")
  } else {
    return res.status(400).send("vendor is not deleted")
  }

}

const vendorList = async (req, res) => {
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
  await vendor.findAndCountAll(option).then((result) => {
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
  createVendor,
  updateVendor,
  deleteVendor,
  vendorList,
  
}