const Joi = require("joi");


const CreateSchema = Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email(),
})

const CustomerDetailSchema = Joi.object({
    image: Joi.string(),
    name: Joi.string(),
    email: Joi.string().email(),
    address_1:Joi.string(),
    address_2:Joi.string(),
    Phone:Joi.number(),
    City: Joi.string(),  
})

// const OrderSchema = Joi.object({
//     product: Joi.string(),
//     quantity: Joi.string(),
// })

const ProductSchema = Joi.object({
    product_name: Joi.string(),
    product_image: Joi.string(),
    product_price:Joi.number(), 
})

module.exports = {

    schemas: {
        CreateSchema: CreateSchema,
        CustomerDetailSchema:CustomerDetailSchema,
        // OrderSchema: OrderSchema
        ProductSchema: ProductSchema
        
    },

    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                const err = result.error.details.flatMap(e => e.message.replace(/"/g, ""))
                return res.status(400).json({
                    message: err
                })
            } else {
                if (!req.value) {
                    req.value = {}
                }
                req.value['body'] = result.value;
                next();
            }
        }
    }
}