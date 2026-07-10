import express from 'express';
import { body } from 'express-validator';
import {
  getAmbassadors,
  getAmbassadorBySlug,
  createAmbassador,
  updateAmbassador,
  deleteAmbassador,
  toggleAmbassadorStatus,
  getAmbassadorStats,
} from '../controllers/ambassadorController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const createAmbassadorValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('ambassadorSlug')
    .notEmpty()
    .withMessage('Ambassador slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
];

const updateAmbassadorValidation = [
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('ambassadorSlug')
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
];

// Public routes (no auth required)
router.get('/slug/:slug', getAmbassadorBySlug);
router.get('/slug/:slug/stats', getAmbassadorStats);

// Protected routes (admin only)
router.get('/', protect, adminOnly, getAmbassadors);
router.post('/', protect, adminOnly, createAmbassadorValidation, createAmbassador);
router.put('/:id', protect, adminOnly, updateAmbassadorValidation, updateAmbassador);
router.delete('/:id', protect, adminOnly, deleteAmbassador);
router.patch('/:id/toggle', protect, adminOnly, toggleAmbassadorStatus);

export default router;