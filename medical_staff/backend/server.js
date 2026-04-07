import express from 'express';
import cors from 'cors';
import { reportRouter, centerRequestRouter } from './routes/reportRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { donorRouter } from './routes/donorRoutes.js';
import { inventoryRouter } from './routes/inventoryRoutes.js';
import { sequelize } from './models/index.js';
import { verifyToken } from './middleware/authMiddleware.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import requestRouter from './routes/bloodRequestRoutes.js';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/initDatabase.js';

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const AUTO_INIT_DB_ON_START = (process.env.AUTO_INIT_DB_ON_START ?? 'true').toLowerCase() === 'true';

app.use(express.json());
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/api/report',verifyToken, reportRouter);
app.use('/api',verifyToken, centerRequestRouter);
app.use('/api/donors',verifyToken, donorRouter);
app.use('/api/inventory',verifyToken, inventoryRouter);
app.use('/api/appointments',verifyToken, appointmentRouter);
app.use('/api/blood-requests',verifyToken, requestRouter);

const startServer = async () => {
  try {
    if (AUTO_INIT_DB_ON_START) {
      await initializeDatabase();
    } else {
      console.log('AUTO_INIT_DB_ON_START=false, skipping startup DB initialization.');
    }

    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to initialize or connect to the database:', error);
    process.exit(1);
  }
};

startServer();