import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Proof = sequelize.define('Proof', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  registrationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

export default Proof;