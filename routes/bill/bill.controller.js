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
            image: `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}`,
          
            // dateId: req.body.dateId,	
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

// const updateBill = async (req, res) => {
//     try {
//         // console.log("Request body:", req.body);
//         // console.log("Request file:", req.file);

//         const constructionStatusId = await bill.findOne({
//             where: { id: req.params.id }
//         });

//         if (!constructionStatusId) {
//             return res.status(400).send("bill not found");
//         }

//         let updateData = {};

//         // Only add fields to updateData if they are present in the request body
//         // if (req.body.dateId) updateData.slot = req.body.dateId;

//         // Handle image update
//         if (req.file && req.file.filename) {
//             console.log("New image file:", req.file.filename);
//             const imagepaths = constructionStatusId.image;
//             if (imagepaths) {
//                 const filepath = imagepaths.replace(`${req.protocol}://${req.get("host")}`, '');
//                 const fullPath = path.join(process.cwd(), filepath);
//                 try {
//                     await fs.unlink(fullPath);
//                     console.log('Successfully deleted old image');
//                 } catch (unlinkError) {
//                     console.error('Failed to delete old image:', unlinkError);
//                     // Continue with the update even if old image deletion fails
//                 }
//             }
//             updateData.image = `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}`;
//         }

//         console.log("Update data:", updateData);

//         // Only proceed with update if there's data to update
//         if (Object.keys(updateData).length > 0) {
//             const [updatedRows] = await bill.update(updateData, {
//                 where: { id: req.params.id }
//             });

//             if (updatedRows > 0) {
//                 return res.status(200).send("bill is updated");
//             } else {
//                 return res.status(400).send("No changes were made to the bill");
//             }
//         } else {
//             return res.status(400).send("No data provided for update");
//         }
//     } catch (error) {
//         console.error('Error updating banner:', error);
//         return res.status(500).send("Internal server error");
//     }
// }
const updateBill = async (req, res) => {
    const { id } = req.params;
    const directoryPath = __basedir + "/public/images/";

    try {
        // Find the existing bill by primary key (id)
        const data = await bill.findByPk(id);

        if (!data) {
            return res.status(404).send("Bill not found");
        }

        // Prepare update options from the request body
        const option = {
            date: req.body.date,
            companyId: req.body.companyId
        };

        // If a file is uploaded, update the image path
        if (req.file) {
            option.image = `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}`;
        }

        // Update the bill in the database
        await bill.update(option, {
            where: { id },
        });

        // If a new file was uploaded and the bill had a previous image, delete the old image
        if (req.file && data.image) {
            const filename = path.basename(data.image);
            fs.unlink(directoryPath + filename, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                }
            });
        }

        // Send success response
        res.send("Bill updated successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: err.message });
    }
};

// const deleteBill = async (req,res) => {

//     const constructionStatusid = await bill.findOne({
//         where: {id: req.params.id}
//     }) 

//     if(!constructionStatusid){
//         return  res.status(400).send("bill not found")
//     }
    
//     const imagepaths = constructionStatusid.image.split(';')
    
//     imagepaths.map( async (imagepath) => {
//             const directorypath = __basedir + "/public/images/";
//             await fs.unlink( directorypath + path.basename(imagepath))
//     })

//     const Delete = await bill.destroy({
//         where: {id: req.params.id}
//     })

//     if (Delete) {
//         return res.status(200).send("bill is deleted")
//     } else {
//         return res.status(400).send("bill is not deleted")
//     }

// }
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
        where: {
        //    clientId: req.userId
        },
        include:[
            {
                model: db.company,
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