// const db = require("../../config/connection")
// const vat = db.vat
// const client = db.client
// const company = db.company
// const purchase= db.purchase
// const sale = db.sale
// require("../../middleware/auth")
// const pg = require('../../utils/pagination')
// const { Op } = require("sequelize");
// const companyModel = db.company
const db = require("../../config/connection")
const vat = db.vat
const client = db.client
const companyModel = db.company // Renaming to avoid conflict
const purchase = db.purchase
const sale = db.sale
require("../../middleware/auth")
const pg = require('../../utils/pagination')
const { Op } = require("sequelize");
const sequelize = db.Sequelize;

// const createvat = async (req, res) => {
    
//     const vatTaxAmount = sales_total_amount + purchase_total_amount;

//     const create = await vat.create({
//         purchase_total_amount: req.body.purchase_total_amount,
//         sales_total_amount:req.body.sales_total_amount,
//         total_tax_amount: vatTaxAmount,
//         companyId: req.body.companyId,
    
//     })
//     if (create) {
//         return res.status(200).send("vat created successfully")
//     } else {
//         return res.status(400).send("vat not created")
//     }
// }
// const createvat = async (req, res) => {
//     try {
//       // Fetch the sum of purchase tax amounts for the specified company
//       const purchaseData = await purchase.findOne({
//         where: { companyId: req.body.companyId },
//         attributes: [[sequelize.fn('SUM', sequelize.col('purchase_tax_amount')), 'purchase_total_amount']],
//         raw: true,
//       });
  
//       // Fetch the sum of sales tax amounts for the specified company
//       const salesData = await sale.findOne({
//         where: { companyId: req.body.companyId },
//         attributes: [[sequelize.fn('SUM', sequelize.col('sale_tax_amount')), 'sales_total_amount']],
//         raw: true,
//       });
  
//       // If either purchase or sales data is missing, handle it appropriately
//       const purchase_total_amount = purchaseData ? purchaseData.purchase_total_amount : 0;
//       const sales_total_amount = salesData ? salesData.sales_total_amount : 0;
  
//       // Calculate the VAT amount
//       const vatTaxAmount = parseFloat(purchase_total_amount) + parseFloat(sales_total_amount);
  
//       // Create the VAT record
//       const create = await vat.create({
//         purchase_total_amount,
//         sales_total_amount,
//         total_tax_amount: vatTaxAmount,
//         companyId: req.body.companyId,
//       });
  
//       // Respond based on success or failure
//       if (create) {
//         return res.status(200).send("VAT created successfully");
//       } else {
//         return res.status(400).send("VAT not created");
//       }
//     } catch (error) {
//       console.error("Error creating VAT:", error);
//       return res.status(500).send("An error occurred while creating VAT");
//     }
//   };

const createvat = async (req, res) => {
    try {
      // Fetch the company's vat_effective_date (ved)
      const company = await companyModel.findOne({
        where: { id: req.body.companyId },
        attributes: ['ved'],
        raw: true,
      });
  
      if (!company) {
        return res.status(404).send("Company not found");
      }
  
      // Calculate the start date for the last 3 months
      const vatEffectiveDate = new Date(company.ved);
      const threeMonthsAgo = new Date(vatEffectiveDate);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // Subtract 3 months
  
      // Query for purchase data in the last 3 months
      const purchaseData = await purchase.findOne({
        where: {
          companyId: req.body.companyId,
          date: {
            [Op.between]: [threeMonthsAgo, vatEffectiveDate], // 3-month date range
          },
        },
        attributes: [[sequelize.fn('SUM', sequelize.col('purchase_tax_amount')), 'purchase_total_amount']],
        raw: true,
      });
  
      // Query for sales data in the last 3 months
      const salesData = await sale.findOne({
        where: {
          companyId: req.body.companyId,
          date: {
            [Op.between]: [threeMonthsAgo, vatEffectiveDate], // 3-month date range
          },
        },
        attributes: [[sequelize.fn('SUM', sequelize.col('sale_tax_amount')), 'sales_total_amount']],
        raw: true,
      });
  
      // Handle missing data (if no data is returned, fallback to 0)
      const purchase_total_amount = purchaseData && purchaseData.purchase_total_amount ? parseFloat(purchaseData.purchase_total_amount) : 0;
      const sales_total_amount = salesData && salesData.sales_total_amount ? parseFloat(salesData.sales_total_amount) : 0;
  
      // Calculate the VAT amount
      const vatTaxAmount = purchase_total_amount + sales_total_amount;
  
      // Create the VAT record
      const create = await vat.create({
        purchase_total_amount,
        sales_total_amount,
        total_tax_amount: vatTaxAmount,
        companyId: req.body.companyId,
      });
  
      // Return success or failure response
      if (create) {
        return res.status(200).send("VAT created successfully");
      } else {
        return res.status(400).send("VAT not created");
      }
    } catch (error) {
      console.error("Error creating VAT:", error);
      return res.status(500).send("An error occurred while creating VAT");
    }
  };
const updatevat = async (req, res) => {

    const update = await vat.update({

        purchase_total_amount: req.body.purchase_total_amount,
        sales_total_amount:req.body.sales_total_amount,
        total_tax_amount: vatTaxAmount,
        companyId: req.body.companyId,

    }, {
        where: { id: req.params.id }
    })

    if (update) {
        return res.status(200).send("vat is updated")
    } else {
        return res.status(400).send("vat not updated")
    }
}

const deletevat = async (req, res) => {

    const adminid = await vat.findOne({
        where: { id: req.params.id }
    })

    if (!adminid) {
        return res.status(400).send("Admin not found")
    }

    const Delete = await vat.destroy({
        where: { id: req.params.id }
    })

    if (Delete) {
        return res.status(200).send("Admin is deleted")
    } else {
        return res.status(400).send("Admin is not deleted")
    }

}

const vatList = async (req, res) => {
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

    await vat.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        });
    });
}
const vatListByClient = async (req, res) => {
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

    await vat.findAndCountAll(option).then((result) => {
        const response = pg.getPagingData(result, page, limit);
        res.send(response);
    }).catch(err => {
        res.status(400).send({
            response: 'error',
            message: err.message
        });
    });
}

const vatAmount = async (req, res) => {
   
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
        const result = await vat.findAndCountAll(option);

        // Calculate the total amount
        const totalAmount = result.rows.reduce((sum, vat) => {
            return sum + vat.amount;
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
    createvat,
    updatevat,
    deletevat,
    vatList,
    vatListByClient,
    vatAmount

}