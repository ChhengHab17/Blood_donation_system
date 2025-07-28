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

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/auth', authRouter);
app.use('/api/report',verifyToken, reportRouter);
app.use('/api',verifyToken, centerRequestRouter);
app.use('/api/donors',verifyToken, donorRouter);
app.use('/api/inventory',verifyToken, inventoryRouter);
app.use('/api/appointments',verifyToken, appointmentRouter);
app.use('/api/blood-requests',verifyToken, requestRouter);
// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})