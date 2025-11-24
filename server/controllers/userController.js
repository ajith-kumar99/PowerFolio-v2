import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { uploadFile } from '../utils/imageKit.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      college: user.college, // This was correct
      about: user.about      // This was correct
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.college = req.body.college || user.college;
    user.about = req.body.about || user.about;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Handle Profile Picture Upload
    if (req.file) {
        const imageUrl = await uploadFile(req.file.buffer, `avatar-${user._id}`);
        user.profilePicture = imageUrl;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      college: updatedUser.college, // Added this
      about: updatedUser.about,     // Added this
      token: req.headers.authorization.split(' ')[1] 
    });
    
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getUserProfile, updateUserProfile };