import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import { uploadFile } from '../utils/imageKit.js';

// @desc    Get all projects
// @route   GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { 'author.name': { $regex: req.query.keyword, $options: 'i' } },
          { technologies: { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
    : {};

  const projects = await Project.find({ ...keyword, status: 'Approved' })
    .populate('author', 'name email profilePicture')
    .sort({ createdAt: -1 });
    
  res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('author', 'name email profilePicture college');

  if (project) {
    // Unique View Logic
    // Only track unique views if user is logged in (passed via protect middleware or optional auth check)
    // Note: Since this is a public route, req.user might be undefined. 
    // We need to check if a user is viewing it.
    // Ideally, we pass a token even for public views if available, or we skip this for guests.
    // For this implementation, we check if a userId was passed in body or query, 
    // OR we rely on the frontend calling a separate secure endpoint for tracking.
    // SIMPLER APPROACH for this assignment: 
    // We will assume the frontend sends the Authorization header even for this GET request if user is logged in.
    // We need to decode it here manually or make a "view" endpoint. 
    // Let's modify this controller to try and read the user if available.
    
    // Note: This requires the route to apply middleware optionally or we check headers manually.
    // See routes update below.
    
    if (req.user && !project.views.includes(req.user._id)) {
        project.views.push(req.user._id);
        await project.save();
    }
    
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const {
    title, type, shortDescription, detailedDescription, outcome,
    duration, startDate, technologies, teamMembers, links,
  } = req.body;

  let screenshotUrls = [];
  if (req.files && req.files['screenshots']) {
    const uploadPromises = req.files['screenshots'].map(file => 
        uploadFile(file.buffer, file.originalname)
    );
    screenshotUrls = await Promise.all(uploadPromises);
  }

  let videoUrl = '';
  if (req.files && req.files['videoDemo']) {
    const videoFile = req.files['videoDemo'][0];
    videoUrl = await uploadFile(videoFile.buffer, videoFile.originalname);
  }

  const project = new Project({
    title, type, shortDescription, detailedDescription, outcome,
    duration, startDate,
    technologies: JSON.parse(technologies),
    teamMembers: JSON.parse(teamMembers),
    links: JSON.parse(links),
    author: req.user._id,
    media: {
        screenshots: screenshotUrls,
        videoDemo: videoUrl
    }
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

const getMyProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

const likeProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(project) {
        if(project.likes.includes(req.user._id)) {
            project.likes = project.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            project.likes.push(req.user._id);
        }
        await project.save();
        res.json(project.likes);
    } else {
        res.status(404);
        throw new Error('Project Not Found');
    }
});

export { getProjects, getProjectById, createProject, getMyProjects, deleteProject, likeProject };