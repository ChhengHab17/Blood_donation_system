import {Router} from 'express';
import { register, login, getDonationCenters } from '../controller/authController.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/donation-centers', getDonationCenters);