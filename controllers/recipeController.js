const Recipe = require('../models/recipe');

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, category } = req.body;
    const createdBy = req.userId; // Get the authenticated user's ID from request object

    // Check if an image file is uploaded
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path; // Use the path of the uploaded image file
    }

    const recipe = new Recipe({ title, ingredients, instructions, category, createdBy, imageUrl });
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
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('category', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
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
  

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };
