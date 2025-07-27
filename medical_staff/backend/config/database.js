import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'blood_donation_system',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan',
  {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'centerbeam.proxy.rlwy.net',
    port: process.env.DB_PORT || '43047',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;