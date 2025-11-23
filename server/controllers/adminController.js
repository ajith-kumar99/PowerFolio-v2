import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Project from '../models/Project.js';

// @desc    Get admin stats
// @route   GET /api/admin/stats
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProjects = await Project.countDocuments();
  const pendingProjects = await Project.countDocuments({ status: 'Pending' });
  const approvedProjects = await Project.countDocuments({ status: 'Approved' });

  res.json({
    totalUsers,
    totalProjects,
    pendingProjects,
    approvedProjects
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Get ALL projects (for admin dashboard lists)
// @route   GET /api/admin/projects
const getAllProjects = asyncHandler(async (req, res) => {
    // Fetch all projects, populated with author details
    const projects = await Project.find({})
        .populate('author', 'name email')
        .sort({ createdAt: -1 });
    res.json(projects);
});

// @desc    Update project status
// @route   PATCH /api/admin/projects/:id
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

export { getAdminStats, getUsers, updateProjectStatus, getAllProjects };