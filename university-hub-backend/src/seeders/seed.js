import sequelize from '../config/database.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

const seedUsers = async () => {
    try {
        const adminExists = await User.findOne({ where: { email: 'admin@university.edu' } });
        if (!adminExists) {
            const admin = await User.create({
                name: 'Admin User',
                email: 'admin@university.edu',
                password: 'admin123',
                role: 'admin',
                isActive: true,
            });
            console.log('Admin user created:', admin.email);
        }

        const malcolmExists = await User.findOne({ where: { email: 'malcolm@university.edu' } });
        if (!malcolmExists) {
            const malcolm = await User.create({
                name: 'Malcolm Mwakitwange',
                email: 'malcolm@university.edu',
                password: 'malcolm123',
                role: 'ambassador',
                ambassadorSlug: 'malcolm',
                isActive: true,
            });
            console.log('Ambassador user created:', malcolm.email);
        }

        const ambassadors = [
            { name: 'Sarah Johnson', email: 'sarah@university.edu', slug: 'sarah' },
            { name: 'David Chen', email: 'david@university.edu', slug: 'david' },
        ];

        for (const amb of ambassadors) {
            const exists = await User.findOne({ where: { email: amb.email } });
            if (!exists) {
                await User.create({
                    name: amb.name,
                    email: amb.email,
                    password: 'ambassador123',
                    role: 'ambassador',
                    isActive: true,
                });
                console.log(`Ambassador user created: ${amb.email}`);
            }
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seedUsers();