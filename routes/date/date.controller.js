const db = require("../../config/connection")
const  date = db.date
const month = db.month
const year = db.year
const { Op } = require("sequelize");
const pg = require('../../utils/pagination')

const createDate = async (req,res) => {
    try {

        const create = await date.create({
            day: req.body.day,
            // monthId: req.body.monthId,
        })
        if (create) {
            return res.status(200).send("date created successfully")
        } else {
            return res.status(400).send("date not created")
        }     
           
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")  
    }

}

const BulkcreateDate = async (req, res) => {
    try {
        // Extract an array of dates from the request body
        const datesArray = req.body.day;

        // Perform bulk create operation
        const create = await date.bulkCreate(datesArray);

        if (create) {
            return res.status(200).send("Dates created successfully");
        } else {
            return res.status(400).send("Dates not created");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}


const updateDate = async (req,res) => {

    const constructionStatusid = await date.findOne({
        where: {id: req.params.id}
    }) 

    if(!constructionStatusid){
        return res.status(400).send("date not found")
    }

    const update = await date.update({
        dates: req.body.dates,
        // monthId: req.body.monthId,
        
    },{
        where: {id: req.params.id}
    })

    if (update) {
        return res.status(200).send("date is updated")
    } else {
        return res.status(400).send("date not updated")
    }
}

const deleteDate = async (req,res) => {

    const constructionStatusid = await date.findOne({
        where: {id: req.params.id}
    }) 

    if(!constructionStatusid){
        return  res.status(400).send("date not found")
    }
    
    const Delete = await date.destroy({
        where: {id: req.params.id}
    })

    if (Delete) {
        return res.status(200).send("date is deleted")
    } else {
        return res.status(400).send("date is not deleted")
    }

}

const readDate = async (req,res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {
        //    clientId: req.userId
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
    await date.findAndCountAll(option).then((result) => {
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
    createDate,
    BulkcreateDate,
    updateDate,
    deleteDate,
    readDate
}