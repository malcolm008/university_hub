import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GalleryImage = sequelize.define('GalleryImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default GalleryImage;