const db = require("../../config/connection")
const subcategory = db.subcategory
require("../../middleware/auth")
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')


const createCategory = async (req, res) => {

  const create = await subcategory.create({
    sub_name: req.body.sub_name,
    categoryId :req.body.categoryId ,
    // clientId: req.userId,
    
  })
  if (create) {
    return res.status(200).send("Sub category created successfully")
  } else {
    return res.status(400).send("Sub category not created")
  }
}


const updateCategory = async (req, res) => {

  const adminid = await subcategory.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("Sub Category not found")
  }


  const update = await subcategory.update({
    sub_name: req.body.sub_name,
     categoryId :req.body.categoryId ,
    

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

  const adminid = await subcategory.findOne({
    where: { id: req.params.id }
  })

  if (!adminid) {
    return res.status(400).send("subcategory not found")
  }

  const Delete = await subcategory.destroy({
    where: { id: req.params.id }
  })

  if (Delete) {
    return res.status(200).send("subcategory is deleted")
  } else {
    return res.status(400).send("subcategory is not deleted")
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
  await subcategory.findAndCountAll(option).then((result) => {
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