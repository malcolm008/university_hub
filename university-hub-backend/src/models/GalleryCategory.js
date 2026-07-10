import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GalleryCategory = sequelize.define('GalleryCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'fa-image',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default GalleryCategory;