const db = require("../../config/connection")
const purchase = db.purchase
const client = db.client
const company = db.company
require("../../middleware/auth")
const pg = require('../../utils/pagination')
const { Op } = require("sequelize");


const createPurchase = async (req, res) => {
    const vatRate = 5;
    const purchaseTaxAmount = req.body.amount * (vatRate / 100);

    const create = await purchase.create({
        // dateId: req.body.dateId,
         name: req.body.name,
        date:req.body.date,
        amount: req.body.amount,
        companyId: req.body.companyId,
        vendorId: req.body.vendorId,
        purchase_tax_amount: purchaseTaxAmount,
        status: "1"
    })
    if (create) {
        return res.status(200).send("purchase created successfully")
    } else {
        return res.status(400).send("purchase not created")
    }
}



const updatePurchase = async (req, res) => {

    const update = await purchase.update({
        // dateId: req.body.dateId,
         name: req.body.name,
        date:req.body.date,
        amount: req.body.amount,
        companyId: req.body.companyId,
        vendorId: req.body.vendorId,
        purchase_tax_amount: req.body.purchase_tax_amount,
        status: req.body.status

    }, {
        where: { id: req.params.id }
    })

    if (update) {
        return res.status(200).send("Purchase is updated")
    } else {
        return res.status(400).send("Purchase not updated")
    }
}

const deletePurchase = async (req, res) => {

    const adminid = await purchase.findOne({
        where: { id: req.params.id }
    })

    if (!adminid) {
        return res.status(400).send("Admin not found")
    }

    const Delete = await purchase.destroy({
        where: { id: req.params.id }
    })

    if (Delete) {
        return res.status(200).send("Admin is deleted")
    } else {
        return res.status(400).send("Admin is not deleted")
    }

}

const PurchaseList = async (req, res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
  
    const option = {
        where: {},
        include: [
            {
                model: company,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: client,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },

                    }
                ]
            },
            // {
            //     model: db.date,
            //     attributes: { exclude: ['createdAt', 'updatedAt'] },
            //     include: [
            //         {
            //             model: db.month,
            //             attributes: { exclude: ['createdAt', 'updatedAt'] },
            //         }
            //     ]
            // }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    };

    if (id) {
        option.where.id = id;
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` };
    }

    await purchase.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        });
    });
}
const PurchaseListByClient = async (req, res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
  

    const option = {
        where: {},
        include: [
            {
                model: company,
                where: { clientId: req.userId },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: client,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },

                    }
                ]
            },
            // {
            //     model: db.date,
            //     attributes: { exclude: ['createdAt', 'updatedAt'] },
            //     include: [
            //         {
            //             model: db.month,
            //             attributes: { exclude: ['createdAt', 'updatedAt'] },
            //         }
            //     ]
            // }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    };

    if (id) {
        option.where.id = id;
    }
    if (name) {
        option.where.name = { [Op.like]: `%${name}%` };
    }

    await purchase.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        });
    });
}

const PurchaseAmount = async (req, res) => {
   
    const option = {
        where: {},
        include: [
            {
                model: company,
                where: { clientId: req.userId },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: client,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ]
            }
        ],
    };

    try {
        const result = await purchase.findAndCountAll(option);

        // Calculate the total amount
        const totalAmount = result.rows.reduce((sum, purchase) => {
            return sum + purchase.amount;
        }, 0);

        // Send the total amount as response
        res.send(totalAmount.toString());
    } catch (err) {
        res.status(400).send({
            response: 'error',
            message: err.message
        });
    }
};


module.exports = {
    createPurchase,
    updatePurchase,
    deletePurchase,
    PurchaseList,
    PurchaseListByClient,
    PurchaseAmount

}