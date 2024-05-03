const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe,getRecipesByCategory , createComment, getCommentsByRecipeId  } = require('../controllers/recipeController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const Recipe = require('../models/recipe');



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

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    
    // Use a regular expression to perform a case-insensitive search for recipes
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } },
        { instructions: { $regex: query, $options: 'i' } }
      ]
    }).exec();

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/:recipeId', getRecipeById);

router.get('/category/:categoryId', getRecipesByCategory);

// Update a recipe
router.put('/:recipeId', authenticateToken, updateRecipe);

// Delete a recipe
router.delete('/:recipeId', authenticateToken, deleteRecipe);

router.post('/:recipeId/comments',authenticateToken, createComment);

// Route to get comments for a specific recipe
router.get('/:recipeId/comments',authenticateToken, getCommentsByRecipeId);




module.exports = router;
