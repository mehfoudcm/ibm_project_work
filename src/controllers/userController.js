// src/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  // Destructure expected fields from request body
  const { username, email, password } = req.body;

  try {
    // Hash the user password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document (adjust to your Mongoose model if needed)
    const newUser = new User({ username, email, password: hashedPassword });

    // Save to database
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    // Handle errors (e.g., validation, DB errors)
    res.status(500).json({ error: 'Registration failed.' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  // Destructure expected fields from request body
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, return 404
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    // If password does not match
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    // Sign a JWT with the user id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    // Catch any runtime errors
    res.status(500).json({ error: 'Login failed.' });
  }
};
