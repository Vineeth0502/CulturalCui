// Import necessary modules and setup router
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Route handler for /profile
router.get('/', authenticateToken, (req, res) => {
  // If the request reaches here, it means the token is valid and user is authenticated
  // Render the profile page
  console.log("i am here in profile");
  res.render('login');
});

// Export the router
module.exports = router;
