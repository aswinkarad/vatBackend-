const db = require("../../config/connection")
const bill  = db.bill
const date  = db.date
const fs = require('fs');
const path = require('path')
const { Op, where } = require("sequelize");
const pg = require('../../utils/pagination')

const createBill = async (req,res) => {
    try {
       
        const create = await bill.create({
            image: `${req.protocol}s://${req.get("host")}/public/images/${req.file.filename}`,
            date:req.body.date,
            companyId : req.body.companyId 
        })
        if (create) {
            return res.status(200).send("bill created successfully")
        } else {
            return res.status(400).send("bill not created")
        }
    
           
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")  
    }

}
const updateBill = async (req, res) => {
    const { id } = req.params;
    const directoryPath = __basedir + "/public/images/";

    try {
        const data = await bill.findByPk(id);

        if (!data) {
            return res.status(404).send("Bill not found");
        }
        const option = {
            date: req.body.date,
            companyId: req.body.companyId
        };

        if (req.file) {
            option.image = `${req.protocol}s://${req.get("host")}/public/images/${req.file.filename}`;
        }
        await bill.update(option, {
            where: { id },
        });
        if (req.file && data.image) {
            const filename = path.basename(data.image);
            fs.unlink(directoryPath + filename, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                }
            });
        }
        res.send("Bill updated successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: err.message });
    }
};


const deleteBill = async (req, res) => {

    const targetBanner = await bill.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!targetBanner) {
        return res.status(400).send(new ErrorRes('bill does not exist').message)
    }
    const directoryPath = __basedir + "/public/images/";

   
    fs.unlink(directoryPath + path.basename(targetBanner.image), (err) => {
        if (err) {
            return console.log(err)
        }
    })
    await targetBanner.destroy().then(() => {
        res.send("Bill deleted successfully");
    }).catch(err => {
         res.send("Bill delete error");
    })

}


const readBill = async (req,res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: { },
        include:[
            {
                model: db.company,
                where: { clientId: req.userId },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: db.client,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ]
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
    await bill.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })
}

const BillListBYCOMPANY = async (req,res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: { },
        include:[
            {
                model: db.company,
              
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: db.client,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ]
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
    await bill.findAndCountAll(option).then((result) => {
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
    createBill,
    updateBill,
    deleteBill,
    readBill,
    BillListBYCOMPANY
    
}