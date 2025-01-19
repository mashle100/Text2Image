// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();

// app.use(bodyParser.json());
// let cors = require('cors');

// app.use(cors({origin:'http://localhost:3000'}));

// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World');
//     }
// );

// mongoose.connect("mongodb://localhost:27017/TexttoImage", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

//   const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   });
  
//   const User = mongoose.model('User', userSchema);
  
//   // Images Schema
//   const imageSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     imageUrl: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   });
  
//   const Image = mongoose.model('Image', imageSchema);

//   app.post('/signup', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//       }
  
//       // Check if the user already exists
//       const existingUser = await User.findOne({ username });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Username already exists' });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Create a new user
//       const newUser = new User({ username, password: hashedPassword });
//       await newUser.save();
  
//       res.status(201).json({ message: 'User created successfully' });
//     } catch (err) {
//       console.error('Error during signup:', err); // Logs detailed error for debugging
//       res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
//   });

//   app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       // Find the user
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid username or password' });
//       }
  
//       // Compare passwords
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid username or password' });
//       }
  
//       // Redirect to the chat page
//       res.status(200).json({ message: 'Login successful', redirectUrl: '/detail' });
//     } catch (err) {
//       res.status(500).json({ message: 'Error during login', error: err });
//     }
//   });
// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// }
// );

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from React app
app.use(express.json());

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/TexttoImage', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Images Schema
const imageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);

// User Signup
app.post('/signup', async (req, res) => {
    const { username, Password } = req.body;
  
    try {
      // Validate input
      if (!username || !Password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required',
        });
      }
  
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists',
        });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      // Save new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({
        success: true,
        message: 'User created successfully',
      });
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  });
// User Login
app.post('/login', async (req, res) => {
    console.log('Request Body:', req.body);  // Add this log
  
    const { username, Password } = req.body;
  
    // Validate input
    if (!username || !Password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }
  
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid username or password',
        });
      }
  
      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(Password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid username or password',
        });
      }
  
      // Successful login
      res.status(200).json({
        success: true,
        message: 'Login successful',
      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: err.message,
      });
    }
  });

  app.get('/images/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      // Find the user by username
      const user = await Image.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch images for the user
      const userImages = await Image.find({ username:username }).sort({ createdAt: -1 }).select('imageUrl'); // Sort by latest
  
      res.json(userImages);
    } catch (error) {
      console.error("Error fetching user images:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

 app.get('/api/images/:username', async (req, res) => {
    try {
      const { username } = req.params;
  
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find images for the user
      const images = await Image.find({ username:username });
  
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  app.get('/image-count/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the count of images for the user
    const imageCount = await Image.countDocuments({ username: username });

    // Respond with the image count
    res.status(200).json(imageCount);
  } catch (err) {
    console.error('Error fetching image count:', err);
    res.status(500).json({message: 'Internal Server Error', error: err.message });
  }
});



  
  
// Start the Server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
