const db = require("../../config/connection")
const category = db.category
require("../../middleware/auth")
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')


const createCategory = async (req, res) => {

  const create = await category.create({
    cat_name: req.body.cat_name,
    // clientId: req.userId,
    
  })
  if (create) {
    return res.status(200).send("category created successfully")
  } else {
    return res.status(400).send("category not created")
  }
}


const updateCategory = async (req, res) => {

  const adminid = await category.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("Category not found")
  }


  const update = await category.update({
    cat_name: req.body.cat_name,
    

  }, {
    where: { id: req.params.id }
  })

  if (update) {
    return res.status(200).send("email is updated")
  } else {
    return res.status(400).send("email not updated")
  }
}

const deleteCategory = async (req, res) => {

  const adminid = await category.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("category not found")
  }

  const Delete = await category.destroy({
    where: { id: req.params.id }
  })

  if (Delete) {
    return res.status(200).send("category is deleted")
  } else {
    return res.status(400).send("category is not deleted")
  }

}

const CategoryList = async (req, res) => {
  const { page, size, id, name } = req.query;
  const { limit, offset } = pg.getPagination(page, size);
  const option = {
    where: {

    },
    // include: [
    //   {
    //     model: client,
    //     attributes: { exclude: ['createdAt', 'updatedAt'] },
    //   }

    // ],

    limit, offset,
    order: [['createdAt', 'DESC']],
  }
  if (id) {
    option.where.id = id
  }
  if (name) {
    option.where.name = { [Op.like]: `%${name}%` }
  }
  await category.findAndCountAll(option).then((result) => {
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
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryList,
  
}