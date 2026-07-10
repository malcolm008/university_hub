import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  programme: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referrerSlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proofStatus: {
    type: DataTypes.ENUM('pending', 'submitted', 'validated'),
    defaultValue: 'pending',
  },
  proofSubmittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  validated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  validatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  appliedToUniversity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  appliedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  consent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reminderSent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastReminderSent: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Registration;