import express from 'express';
import { getAdminStats, getUsers, updateProjectStatus, getAllProjects } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getUsers);
router.get('/projects', protect, admin, getAllProjects); // Crucial for the project lists
router.patch('/projects/:id', protect, admin, updateProjectStatus);

export default router;