import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'ambassador', 'applicant'),
        defaultValue: 'applicant',
    },
    ambassadorSlug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    lastLogin: {
        type: DataTypes.DATE,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    socialLinks: {
        type: DataTypes.JSONB,
        defaultValue: {},
    },
    totalReferrals: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
    },
});

User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default User;