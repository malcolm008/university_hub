import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Check if we should use SQLite
const useSQLite = process.env.USE_SQLITE === 'true' || !process.env.DB_HOST;

let sequelize;

if (useSQLite) {
  // SQLite configuration
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
  console.log('📦 Using SQLite database (file: database.sqlite)');
} else {
  // PostgreSQL configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Function to ensure database exists
const ensureDatabaseExists = async () => {
  if (useSQLite) {
    console.log('✅ SQLite database ready (file will be created automatically)');
    return true;
  }

  try {
    await sequelize.authenticate();
    console.log(`✅ Database "${process.env.DB_NAME}" exists and connection is successful.`);
    return true;
  } catch (error) {
    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log(`📦 Database "${process.env.DB_NAME}" does not exist. Creating it...`);
      
      const tempSequelize = new Sequelize(
        'postgres',
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: 'postgres',
          logging: false,
        }
      );
      
      try {
        await tempSequelize.query(`CREATE DATABASE ${process.env.DB_NAME};`);
        console.log(`✅ Database "${process.env.DB_NAME}" created successfully!`);
        await tempSequelize.close();
        await sequelize.authenticate();
        console.log(`✅ Connection to "${process.env.DB_NAME}" established.`);
        return true;
      } catch (createError) {
        console.error('❌ Failed to create database:', createError.message);
        return false;
      }
    } else {
      console.error('❌ Database connection error:', error.message);
      return false;
    }
  }
};

export default sequelize;
export { ensureDatabaseExists };