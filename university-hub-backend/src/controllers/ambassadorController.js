import { User, Registration } from '../models/index.js';
import { Op } from 'sequelize';

export const getAmbassadors = async (req, res) => {
    try {
        const { includeInactive } = req.query;
        const where = {};

        if (!includeInactive || includeInactive === 'false') {
            where.isActive = true;
        }

        const ambassadors = await User.findAll({
            where: {
                role: 'ambassador',
                ...where,
            },
            attributes: { exclude: ['password'] },
            include: [{
                model: Registration,
                as: 'registrations',
                attributes: ['id','fullName','email','programme','proofStatus','validated'],
            }],
            order: [['name', 'ASC']],
        });

        const ambassadorWithStats = ambassadors.map(ambassador => {
            const registrations = ambassador.registrations || [];
            const total = registrations.length;
            const submitted = registrations.filter(r => r.proofStatus === 'submitted').length;
            const validated = registrations.filter(r => r.validated).length;
            const pending = total - submitted;
            const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

            return {
                ...ambassador.toJSON(),
                stats: { total, submitted, pending, validated, rate },
            };
        });

        res.json({
            success: true,
            count: ambassadorWithStats.length,
            ambassadors: ambassadorWithStats,
        });
    } catch (error) {
        console.error('Get ambassadors error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAmbassadorBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const ambassador = await User.findOne({
            where: {
                ambassadorSlug: slug,
                role: 'ambassador',
            },
            attributes: { exclude: ['password'] },
            include: [{
                model: Registration,
                as: 'registrations',
                attributes: ['id','fullName','email','programme','proofStatus','validated'],
            }],
        });

        if (!ambassador) {
            return res.status(404).json({ message: 'Ambassador not found' });
        }

        const registrations = ambassador.registrations || [];
        const total = registrations.length;
        const submitted = registrations.filter(r => r.proofStatus === 'submitted').length;
        const validated = registrations.filter(r => r.validated).length;
        const pending = total - submitted;
        const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

        res.json({
            success: true,
            ambassador: {
                ...ambassador.toJSON(),
                stats: { total, submitted, pending, validated, rate },
            },
        });
    } catch (error) {
        console.error('Get ambassador error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createAmbassador = async (req, res) => {
    try {
        const { name, email, password, ambassadorSlug, bio, socialLinks } = req.body;

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingSlug = await User.findOne({ where: { ambassadorSlug } });
        if (existingSlug) {
            return res.status(400).json({ message: 'Ambassador slug already exists' });
        }

        const ambassador = await User.create({
            name,
            email,
            password: password || 'ambassador123',
            role: 'ambassador',
            ambassadorSlug,
            bio: bio || '',
            socialLinks: socialLinks || {},
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: 'Ambassador created successfully',
            ambassador: {
                id: ambassador.id,
                name: ambassador.name,
                email: ambassador.email,
                ambassadorSlug: ambassador.ambassadorSlug,
                bio: ambassador.bio,
                socialLinks: ambassador.socialLinks,
                isActive: ambassador.isActive,
                createdAt: ambassador.createdAt,
            },
        });
    } catch (error) {
        console.error('Create ambassador error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateAmbassador = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, ambassadorSlug, bio, socialLinks, isActive } = req.body;

        const ambassador = await User.findOne({
            where: { id, role: 'ambassador' },
        });

        if (!ambassador) {
            return res.status(404).json({ message: 'Ambassador not found '});
        }

        if (email) {
            const existingEmail = await User.findOne({
                where: { email, id: { [Op.ne]: id } },
            });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        if (ambassadorSlug) {
            const existingSlug = await User.findOne({
                where: { ambassadorSlug, id: { [Op.ne]: id } },
            });
            if (existingSlug) {
                return res.status(400).json({ message: 'Ambassador slug already exists' });
            }
        }

        await ambassador.update({
            name: name || ambassador.name,
            email: email || ambassador.email,
            ambassadorSlug: ambassadorSlug || ambassador.ambassadorSlug,
            bio: bio !== undefined ? bio : ambassador.bio,
            socialLinks: socialLinks !== undefined ? socialLinks : ambassador.socialLinks,
            isActive: isActive !== undefined ? isActive : ambassador.isActive,
        });

        res.json({
            success: true,
            message: 'Ambassador updated successfully',
            ambassador: {
                id: ambassador.id,
                name: ambassador.name,
                email: ambassador.email,
                ambassadorSlug: ambassador.ambassadorSlug,
                bio: ambassador.bio,
                socialLinks: ambassador.socialLinks,
                isActive: ambassador.isActive,
                updatedAt: ambassador.updatedAt,
            },
        });
    } catch (error) {
        console.error('Updated ambassador error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteAmbassador = async (req, res) => {
    try {
        const { id } = req.params;
        const ambassador = await User.findOne({
            where: { id, role: 'ambassador' },
            include: [{
                model: Registration,
                as: 'registrations',
            }],
        });

        if (!ambassador) {
            return res.status(404).json({ message: 'Ambassador not found' });
        }

        const hasReferrals = ambassador.registrations && ambassador.registrations.length > 0;

        if (hasReferrals) {
            await ambassador.update({ isActive: false });
            return res.json({
                success: true,
                message: 'Ambassador has referrals. They have been deactivated instead of deleted.',
                deactivated: true,
            });
        }

        await ambassador.destroy();

        res.json({
            success: true,
            message: 'Ambassador deleted successfully',
        });
    } catch (error) {
        console.error('Delete ambassador error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const toggleAmbassadorStatus = async (req, res) => {
    try {
        const { id } = req.params
        console.log(`Toggling ambassador status for ID: ${id}`);

        const ambassador = await User.findOne({
            where: { id, role: 'ambassador' },
        });

        if (!ambassador) {
            return res.status(404).json({ success: false, message: 'Ambassador not found' });
        }

        const newStatus = !ambassador.isActive;
        await ambassador.update({ isActive: newStatus });

        console.log(`Ambassador ${ambassador.name} ${newStatus ? 'activated': 'deactivated'}`);

        res.json({
            success: true,
            message: `Ambassador ${newStatus ? 'activated' : 'deactivated'} successfully`,
            isActive: newStatus,
        });

    } catch (error) {
        console.error('Toggle ambassador status error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getAmbassadorStats = async (req, res) => {
    try {
        const { slug } = req.params;

        const ambassador = await User.findOne({
            where: { ambassadorSlug: slug, role: 'ambassador' },
            include: [{
                model: Registration,
                as: 'registrations',
            }],
        });

        if (!ambassador) {
            return res.status(404).json({ message: 'Ambassador not found' });
        }

        const registrations = ambassador.registrations || [];
        const total = registrations.length;
        const submitted = registrations.filter(r => r.proofStatus === 'submitted').length;
        const validated = registrations.filter(r => r.validated).length;
        const pending = total - submitted;
        const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

        const monthlyStats = {};
        registrations.forEach(reg => {
            const month = reg.createdAt.toISOString().slice(0, 7);
            if (!monthlyStats[month]) {
                monthlyStats[month] = {total: 0, submitted: 0, validated: 0 };
            }
            monthlyStats[month].total++;
            if (reg.proofStatus === 'submitted')  monthlyStats[month].submitted++;
            if (reg.validated) monthlyStats[month].validated++;
        });

        res.json({
            success: true,
            stats: {
                total,
                submitted,
                validated,
                pending,
                rate,
                monthly: monthlyStats,
            },
        });
    } catch (error) {
        console.error('Get ambassador stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};