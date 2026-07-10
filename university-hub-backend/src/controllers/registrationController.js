import { Registration, User, Proof } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Create new registration
export const createRegistration = async (req, res) => {
  try {
    const { fullName, email, phone, programme, referrerSlug, consent } = req.body;

    // Check if registration already exists
    const existing = await Registration.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ 
        message: 'Registration already exists for this email',
        registrationId: existing.id,
      });
    }

    // Check if referrer exists
    if (referrerSlug) {
      const referrer = await User.findOne({ 
        where: { ambassadorSlug: referrerSlug, role: 'ambassador' } 
      });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referrer' });
      }
    }

    const registration = await Registration.create({
      fullName,
      email,
      phone,
      programme,
      referrerSlug: referrerSlug || 'malcolm',
      consent,
    });

    res.status(201).json({
      success: true,
      registration: {
        id: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        programme: registration.programme,
        referrerSlug: registration.referrerSlug,
        proofStatus: registration.proofStatus,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all registrations (with filters)
export const getRegistrations = async (req, res) => {
  try {
    const { referrerSlug, status, from, to, programme, search } = req.query;
    
    const where = {};
    
    if (referrerSlug) where.referrerSlug = referrerSlug;
    if (status) where.proofStatus = status;
    if (programme) where.programme = programme;
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to) where.createdAt[Op.lte] = new Date(to);
    }

    const registrations = await Registration.findAll({
      where,
      include: [
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Proof,
          as: 'proof',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const registration = await Registration.findByPk(id, {
      include: [
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Proof,
          as: 'proof',
        },
      ],
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ success: true, registration });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registrations by ambassador slug
export const getRegistrationsByAmbassador = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const registrations = await Registration.findAll({
      where: { referrerSlug: slug },
      include: [
        {
          model: Proof,
          as: 'proof',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const stats = {
      total: registrations.length,
      pending: registrations.filter(r => r.proofStatus === 'pending').length,
      submitted: registrations.filter(r => r.proofStatus === 'submitted').length,
      validated: registrations.filter(r => r.validated).length,
    };

    res.json({ success: true, stats, registrations });
  } catch (error) {
    console.error('Get ambassador registrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update registration
export const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.update(updates);

    res.json({ success: true, registration });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};