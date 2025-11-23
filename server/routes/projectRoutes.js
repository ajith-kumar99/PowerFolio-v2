import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  getMyProjects,
  deleteProject,
  likeProject
} from '../controllers/projectController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProjects)
    .post(protect, upload.fields([{ name: 'screenshots', maxCount: 4 }, { name: 'videoDemo', maxCount: 1 }]), createProject);

router.route('/myprojects').get(protect, getMyProjects);

router.route('/:id')
    .get(optionalProtect, getProjectById) // Use optionalProtect to capture user ID for views
    .delete(protect, deleteProject);

router.route('/:id/like').put(protect, likeProject);

export default router;