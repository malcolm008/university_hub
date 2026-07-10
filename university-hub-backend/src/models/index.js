import sequelize from '../config/database.js';
import User from './User.js';
import Registration from './Registration.js';
import Proof from './Proof.js';
import GalleryCategory from './GalleryCategory.js';
import GalleryImage from './GalleryImage.js';

// User - Registration associations
User.hasMany(Registration, { 
  foreignKey: 'referrerSlug', 
  sourceKey: 'ambassadorSlug',
  as: 'registrations'
});
Registration.belongsTo(User, { 
  foreignKey: 'referrerSlug', 
  targetKey: 'ambassadorSlug',
  as: 'referrer'
});

// Registration - Proof associations
Registration.hasOne(Proof, { 
  foreignKey: 'registrationId',
  as: 'proof'
});
Proof.belongsTo(Registration, { 
  foreignKey: 'registrationId',
  as: 'registration'
});

// GalleryCategory - GalleryImage associations
GalleryCategory.hasMany(GalleryImage, { 
  foreignKey: 'categoryId',
  as: 'images'
});
GalleryImage.belongsTo(GalleryCategory, { 
  foreignKey: 'categoryId',
  as: 'category'
});

// User - GalleryImage associations
User.hasMany(GalleryImage, { 
  foreignKey: 'uploadedBy',
  as: 'galleryImages'
});
GalleryImage.belongsTo(User, { 
  foreignKey: 'uploadedBy',
  as: 'uploader'
});

export {
  sequelize,
  User,
  Registration,
  Proof,
  GalleryCategory,
  GalleryImage,
};