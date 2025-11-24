import express from 'express';
import { 
    getAdminStats, 
    getUsers, 
    updateProjectStatus, 
    getAllProjects, 
    deleteUser // Make sure to import this!
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getUsers);
router.get('/projects', protect, admin, getAllProjects);
router.patch('/projects/:id', protect, admin, updateProjectStatus);
router.delete('/users/:id', protect, admin, deleteUser); // Ensure this route exists

export default router;