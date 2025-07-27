import {Router} from 'express';
import { register, login, getDonationCenters } from '../controller/authController.js';
import { verifyToken, validateRegisterInput, validateLoginInput } from '../middleware/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', validateRegisterInput, register);
authRouter.post('/login', validateLoginInput, login);
authRouter.get('/donation-centers', getDonationCenters);