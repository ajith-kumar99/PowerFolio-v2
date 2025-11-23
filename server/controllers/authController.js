import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // --- SPECIAL ADMIN LOGIN LOGIC ---
  if (email === 'admin@gmail.com' && password === 'admin@123') {
    // Check if this admin already exists in DB
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });

    if (!adminUser) {
      // Create the admin on the fly if they don't exist
      console.log("Creating Super Admin...");
      adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        password: 'admin@123', // Will be hashed by the model hook
        role: 'admin',
        profilePicture: '' 
      });
    }

    // Return the token for this admin
    res.json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: 'admin', // Explicitly force role
      profilePicture: adminUser.profilePicture,
      token: generateToken(adminUser._id),
    });
    return; 
  }
  // ---------------------------------

  // Standard User Login
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      college: user.college,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { authUser, registerUser };