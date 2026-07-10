import { Proof, Registration } from '../models/index.js';

// Submit proof
export const submitProof = async (req, res) => {
  try {
    const { registrationId, referenceNumber, notes } = req.body;
    let fileUrl = null;
    let fileName = null;

    // Handle file upload if present
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    // Check if registration exists
    const registration = await Registration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if proof already exists
    const existingProof = await Proof.findOne({ where: { registrationId } });
    if (existingProof) {
      return res.status(400).json({ message: 'Proof already submitted for this registration' });
    }

    // Create proof
    const proof = await Proof.create({
      registrationId,
      referenceNumber,
      notes,
      fileUrl,
      fileName,
      submittedAt: new Date(),
    });

    // Update registration status
    await registration.update({
      proofStatus: 'submitted',
      proofSubmittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      proof,
      registration: {
        id: registration.id,
        proofStatus: registration.proofStatus,
      },
    });
  } catch (error) {
    console.error('Submit proof error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get proof by registration ID
export const getProofByRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    
    const proof = await Proof.findOne({
      where: { registrationId },
      include: [
        {
          model: Registration,
          as: 'registration',
          attributes: ['id', 'fullName', 'email', 'programme'],
        },
      ],
    });

    if (!proof) {
      return res.status(404).json({ message: 'Proof not found' });
    }

    res.json({ success: true, proof });
  } catch (error) {
    console.error('Get proof error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Validate referral (admin only)
export const validateReferral = async (req, res) => {
  try {
    const { registrationId } = req.params;
    
    const registration = await Registration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.proofStatus !== 'submitted') {
      return res.status(400).json({ message: 'Proof must be submitted first' });
    }

    await registration.update({
      validated: true,
      validatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Referral validated successfully',
      registration,
    });
  } catch (error) {
    console.error('Validate referral error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};