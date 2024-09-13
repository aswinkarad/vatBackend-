const db = require("../../config/connection")
const month  = db.month
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')

const createMonth = async (req,res) => {

    try {
       
            const approvalid = await month.findOne({
                where: {name: req.body.name}
            })
            if(approvalid){
                return res.status(400).send("month already exists")
            }
    
            const create = await month.create({
                name: req.body.name,
                
            })

            if (create) {
                return res.status(200).send("month created successfully")
            } else {
                return res.status(400).send("month not created")
            }

    } catch (error) {
      console.log(error)
      res.status(500).send("Internal server error")  
    }
   
}

const BulkcreateMonth = async (req, res) => {
    try {
        // Extract an array of dates from the request body
        const datesArray = req.body.name;

        // Perform bulk create operation
        const create = await month.bulkCreate(datesArray);

        if (create) {
            return res.status(200).send("Month created successfully");
        } else {
            return res.status(400).send("Month not created");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const updateMonth = async (req,res) => {

    const proposalid = await month.findOne({
        where: {id: req.params.id}
    }) 

    if(!proposalid){
        return res.status(400).send("month not found")
    }

    const update = await month.update({
        name: req.body.name,
    },{
        where: {id: req.params.id}
    })

    if (update) {
        return res.status(200).send("month is updated")
    } else {
        return res.status(400).send("month is not updated")
    }
}

const deleteMonth = async (req,res) => {

    const dimensionid = await month.findOne({
        where: {id: req.params.id}
    }) 

    if(!dimensionid){
        return  res.status(400).send("month not found")
    }
    
    const Delete = await month.destroy({
        where: {id: req.params.id}
    })

    if (Delete) {
        return res.status(200).send("month is deleted")
    } else {
        return res.status(400).send("month is not deleted")
    }

}

const readMonth = async (req,res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {  },
       
        limit, offset,
        // order: [['createdAt', 'DESC']] ,
    }
    if (id) {
        option.where.id = id
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` }
    }
    await month.findAndCountAll(option).then((result) => {
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
    createMonth,
    updateMonth,
    deleteMonth,
    readMonth,
    BulkcreateMonth
}