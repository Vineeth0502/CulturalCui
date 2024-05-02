const Recipe = require('../models/recipe');
const Category = require('../models/category');
const Comment = require('../models/commentSchema');

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, category, servingSize, preparationTime,description } = req.body;
    const createdBy = req.userId; // Get the authenticated user's ID from request object

    // Check if an image file is uploaded
    let imageUrl = '';
    if (req.file) {
      console.log(req.file);
      imageUrl = req.file.path; // Use the path of the uploaded image file
    }

    const recipe = new Recipe({ 
      title, 
      ingredients, 
      instructions, 
      category, 
      servingSize, 
      preparationTime, 
      createdBy, 
      description,
      image: imageUrl 
    });
    
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('category', 'name');
    res.render('allrecipies', { recipes });  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('category', 'name').populate('createdBy', 'username');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.render('viewRecipe', { recipe }); // Assuming your EJS template is named 'viewRecipe'
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
    try {
      const { title, ingredients, instructions, category } = req.body;
      const recipeId = req.params.recipeId;
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: recipeId, createdBy: req.userId }, // Ensure only the creator can update the recipe
        { title, ingredients, instructions, category },
        { new: true }
      );
      if (!updatedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(updatedRecipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// Delete a recipe
const deleteRecipe = async (req, res) => {
    try {
      const recipeId = req.params.recipeId;
      const deletedRecipe = await Recipe.findOneAndDelete({ _id: recipeId, createdBy: req.userId }); // Ensure only the creator can delete the recipe
      if (!deletedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
// recipeController.js

const getRecipesByCategory = (req, res) => {
  // Implement the logic to fetch recipes by category here
  // You can access the category ID from req.params.categoryId

  const categoryId = req.params.categoryId;

  // Example: Fetch category name from the database based on the category ID
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Example: Fetch recipes from the database based on the category ID
      Recipe.find({ category: categoryId })
        .then(recipes => {
          res.render('recipesByCategory', { categoryName: category.name, recipes });
          console.log(recipes);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Server Error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    });
};
const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const createdBy = req.userId; // Get the authenticated user's ID from request object
    const recipeId = req.params.recipeId; // Get the recipe ID from request parameters
console.log("d",createdBy)
    const comment = new Comment({ text, createdBy, recipe: recipeId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

// Controller function to get comments for a specific recipe
const getCommentsByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    // Find all comments for the specified recipe and populate the createdBy field with user details
    const comments = await Comment.find({ recipe: recipeId }).populate('createdBy', 'username');
    console.log(comments);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getRecipesByCategory
};

  

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe ,getRecipesByCategory,createComment,getCommentsByRecipeId};
