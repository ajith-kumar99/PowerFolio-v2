import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Project from '../models/Project.js';

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProjects = await Project.countDocuments();
  const pendingProjects = await Project.countDocuments({ status: 'Pending' });
  const approvedProjects = await Project.countDocuments({ status: 'Approved' });

  // Aggregation for Project Types
  const typeStats = await Project.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]);

  // Aggregation for Submission Trends (Last 7 days)
  // Using $dateToString to group by formatted date for better frontend consumption
  const submissionTrends = await Project.aggregate([
    {
       $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
       }
    },
    { $sort: { _id: 1 } } // Sort by date ascending
  ]);

  res.json({
    totalUsers,
    totalProjects,
    pendingProjects,
    approvedProjects,
    typeStats,
    submissionTrends
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Get ALL projects (for admin dashboard lists)
// @route   GET /api/admin/projects
// @access  Private/Admin
const getAllProjects = asyncHandler(async (req, res) => {
    // Fetch all projects, populated with author details
    const projects = await Project.find({})
        .populate('author', 'name email')
        .sort({ createdAt: -1 });
    res.json(projects);
});

// @desc    Update project status
// @route   PATCH /api/admin/projects/:id
// @access  Private/Admin
const updateProjectStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
        if (status === 'Rejected') {
            await project.deleteOne();
            res.json({ message: 'Project rejected and removed', id: req.params.id, status: 'Rejected' });
        } else {
            project.status = status;
            const updatedProject = await project.save();
            res.json(updatedProject);
        }
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Optional: Prevent deleting other admins or super admin
        if (user.email === 'admin@gmail.com') {
            res.status(400);
            throw new Error('Cannot delete Super Admin');
        }

        await user.deleteOne();
        // Also delete user's projects? 
        // await Project.deleteMany({ author: user._id });
        
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { getAdminStats, getUsers, getAllProjects, updateProjectStatus, deleteUser };