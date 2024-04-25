const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Create a new category
router.post('/', createCategory);

// Get all categories
router.get('/', getCategories);

// Get a category by ID
router.get('/:categoryId', getCategoryById);

// Update a category
router.put('/:categoryId', updateCategory);

// Delete a category
router.delete('/:categoryId', deleteCategory);

module.exports = router;
