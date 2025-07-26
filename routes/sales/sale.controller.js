const db = require("../../config/connection")
const sale = db.sale
const client = db.client
const company = db.company
const pg = require('../../utils/pagination')
const { Op } = require("sequelize");


const createSale = async (req, res) => {
    const vatRate = 5;
    const SaleTaxAmount = req.body.amount * (vatRate / 100);

    const create = await sale.create({
        // dateId: req.body.dateId,
        date: req.body.date,
        amount: req.body.amount,
        companyId: req.body.companyId,
        sale_tax_amount: SaleTaxAmount,
        saleTypeId: req.body.saleTypeId,
        status: "1"
    })
    if (create) {
        return res.status(200).send("sale created successfully")
    } else {
        return res.status(400).send("sale not created")
    }


}



const updateSale = async (req, res) => {

    const update = await sale.update({
        // dateId: req.body.dateId,
        date: req.body.date,
        amount: req.body.amount,
        companyId: req.body.companyId,
        sale_tax_amount: req.body.sale_tax_amount,
        status: req.body.status,
        saleTypeId: req.body.saleTypeId,
    }, {
        where: { id: req.params.id }
    })

    if (update) {
        return res.status(200).send("sale is updated")
    } else {
        return res.status(400).send("sale not updated")
    }
}

const deleteSale = async (req, res) => {

    const adminid = await sale.findOne({
        where: { id: req.params.id }
    })

    if (!adminid) {
        return res.status(400).send("Admin not found")
    }

    const Delete = await sale.destroy({
        where: { id: req.params.id }
    })

    if (Delete) {
        return res.status(200).send("Admin is deleted")
    } else {
        return res.status(400).send("Admin is not deleted")
    }

}

const SaleList = async (req, res) => {
    const { page, size, id, name } = req.query;
    const { limit, offset } = pg.getPagination(page, size);
    const option = {
        where: {

        },
        include: [
            {
                model: db.company,
                // where: {
                //     clientId: req.userId
                //  },
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
            //     include:[
            //         {
            //             model: db.month,
            //             attributes: { exclude: ['createdAt', 'updatedAt'] },
            //         }
            //     ]
            // }

        ],
        include: [
            {
                model: db.sale_type,
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
    await sale.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        })
    })

}

const SaleListByClient = async (req, res) => {
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
            //     include:[
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

    await sale.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        });
    });
}

const SaleAmount = async (req, res) => {

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
        const result = await sale.findAndCountAll(option);

        // Calculate the total amount
        const totalAmount = result.rows.reduce((sum, sale) => {
            return sum + sale.amount;
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
    createSale,
    updateSale,
    deleteSale,
    SaleList,
    SaleListByClient,
    SaleAmount

}