// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const recipeRoutes = require('./routes/recipeRoutes'); // Import recipe routes
const bodyParser = require('body-parser');
const path = require('path');
const Category = require('./models/category'); // Import the Category model
const Recipe = require('./models/recipe'); // Import the Category model
const authenticateToken = require('./middleware/authenticateToken');
const profileRoutes = require('./routes/profileRoutes');
// Create an Express application
const app = express();

// Set up middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' }));

// Parse URL-encoded bodies (up to 50MB)
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// Define MongoDB connection URL and database name
const mongoURI = 'mongodb+srv://vineethketham:BpE7Yh74Fb76HF3h@cluster0.twnu23i.mongodb.net/'; // Update with your MongoDB connection URL

const dbName = 'recipesDB'; // Update with your database name
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes); // Use category routes
app.use('/recipes', recipeRoutes); // Use recipe routes
app.use('/profile', profileRoutes); // Use recipe routes
app.get('/dashboard', async (req, res) => {
  try {
    // Fetch categories and recipes from your database
    const categories = await Category.find();
    const recipes = await Recipe.find().populate('category');

    // Render the dashboard.ejs template with the fetched data
    res.render('dashboard', { categories, recipes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/login', (req, res) => {
  res.render('login'); // Render the login.ejs template
});
app.get('/register', (req, res) => {
  res.render('register'); // Render the register.ejs template
});


// Default route to redirect to login page
app.get('/', (req, res) => {
  res.redirect('/login');
});
// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Set up a basic route




app.get('/create', async (req, res) => {
  try {
    // Fetch categories from the database
    const categories = await Category.find();
    res.render('createrecipie', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//dashboard profile
// app.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const createdBy = req.userId; 
//     console.log("ssss",createdBy)

//     // Fetch user details
//     const user = await User.findById(req.userId).select('name email');
//     console.log("user",user)
//     // Fetch recipes created by the user
//     const recipes = await Recipe.find({ createdBy: req.userId }).populate('category');
//     console.log("recipes",recipes)
//     res.render('profile', { user, recipes });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });









// Set up server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
