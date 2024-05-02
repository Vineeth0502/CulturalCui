// Import necessary modules and setup router
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const Recipe = require('../models/recipe'); // Import the Category model

// Route handler for /profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("ssss",req.userId)
    // Fetch user's name from the database
    const user = await User.findById(req.userId);
    const userName = user.username;

    // Fetch recipes created by the user from the database
    // const recipes = await Recipe.find({ createdBy: req.userId });
    const recipes = await Recipe.find({ createdBy: req.userId  }).populate('category', 'name').populate('createdBy');

    res.json({
      userName: user.username,
      recipes: recipes // Assuming user has a recipes field
    });
    // Render the profile page with user's name and recipes
    // res.render('profile', { userName, recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/openprofile', async (req, res) => {
  try {
 
    // Render the profile page with user's name and recipes
     res.render('profile');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Export the router
module.exports = router;
