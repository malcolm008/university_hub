import express from 'express';
import { body } from 'express-validator';
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  getRegistrationsByAmbassador,
  updateRegistration,
} from '../controllers/registrationController.js';
import { protect, adminOnly, ambassadorOnly } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registrationValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('programme').notEmpty().withMessage('Programme is required'),
  body('referrerSlug').notEmpty().withMessage('Referrer is required'),
  body('consent').isBoolean().withMessage('Consent must be a boolean'),
];

// Public routes
router.post('/', registrationValidation, createRegistration);

// Protected routes
router.get('/', protect, getRegistrations);
router.get('/:id', protect, getRegistrationById);
router.get('/ambassador/:slug', protect, ambassadorOnly, getRegistrationsByAmbassador);
router.put('/:id', protect, updateRegistration);

export default router;