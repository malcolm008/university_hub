import express from 'express';
import { body } from 'express-validator';
import {
  submitProof,
  getProofByRegistration,
  validateReferral,
} from '../controllers/proofController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const proofValidation = [
  body('registrationId').notEmpty().withMessage('Registration ID is required'),
  body('referenceNumber').optional(),
  body('notes').optional(),
];

// Routes
router.post('/', protect, uploadSingle('file'), proofValidation, submitProof);
router.get('/registration/:registrationId', protect, getProofByRegistration);
router.put('/validate/:registrationId', protect, adminOnly, validateReferral);

export default router;