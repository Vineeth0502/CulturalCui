const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory for storing uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Use a unique filename for each uploaded file
    }
  });
  const upload = multer({ storage: storage });
  console.log(upload);
                                                             
// Create a new recipe
router.post('/', authenticateToken,  upload.single('image'), createRecipe);

// Get all recipes
router.get('/', getRecipes);

// Get a recipe by ID
router.get('/:recipeId', getRecipeById);

// Update a recipe
router.put('/:recipeId', authenticateToken, updateRecipe);

// Delete a recipe
router.delete('/:recipeId', authenticateToken, deleteRecipe);

module.exports = router;
