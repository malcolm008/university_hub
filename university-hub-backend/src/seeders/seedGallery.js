import sequelize from '../config/database.js';
import { GalleryCategory } from '../models/index.js';

const seedGalleryCategories = async () => {
  try {
    const categories = [
      {
        name: 'Campus Life',
        slug: 'campus-life',
        icon: 'fa-university',
        description: 'Explore our vibrant campus and facilities',
      },
      {
        name: 'Academic Life',
        slug: 'academic-life',
        icon: 'fa-graduation-cap',
        description: 'Learning environments and classrooms',
      },
      {
        name: 'Student Activities',
        slug: 'student-activities',
        icon: 'fa-users',
        description: 'Clubs, sports, and events',
      },
      {
        name: 'International',
        slug: 'international',
        icon: 'fa-globe',
        description: 'Diverse community and global connections',
      },
    ];

    for (const cat of categories) {
      const exists = await GalleryCategory.findOne({ where: { slug: cat.slug } });
      if (!exists) {
        await GalleryCategory.create(cat);
        console.log(`✅ Gallery category created: ${cat.name}`);
      }
    }

    console.log('✅ Gallery seeding completed successfully!');
  } catch (error) {
    console.error('❌ Gallery seeding failed:', error);
  } finally {
    await sequelize.close();
  }
};

seedGalleryCategories();