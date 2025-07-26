const express = require('express');
const router = express.Router();
const controller = require('./category.controller');

// Create a new Category
router.post('/Category/create', controller.createCategory);

// Update an existing Category (edit)
router.put('/Category/update/:id', controller.updateCategory);

// Delete a Category
router.delete('/Category/delete/:id', controller.deleteCategory);

// Get a list of Categorys
router.get('/Category/list', controller.CategoryList);

module.exports = router 