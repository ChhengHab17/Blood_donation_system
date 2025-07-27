import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/reportRoutes.js';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', userRouter);

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