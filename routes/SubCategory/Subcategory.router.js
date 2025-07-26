const express = require('express');
const router = express.Router();
const controller = require('./Subcategory.controller');

// Create a new Category
router.post('/SubCategory/create', controller.createCategory);

// Update an existing Category (edit)
router.put('/SubCategory/update/:id', controller.updateCategory);

// Delete a Category
router.delete('/SubCategory/delete/:id', controller.deleteCategory);

// Get a list of Categorys
router.get('/SubCategory/list', controller.CategoryList);

module.exports = router 