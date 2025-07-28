import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { MedicalStaff, DonationCenter } from '../models/index.js';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (firstName, lastName, email, phoneNumber, role, centerId, password, rePassword) => {
    try{
        console.log('Registering user with data:', { firstName, lastName, email, phoneNumber, role, centerId });
        
        const existingUser = await MedicalStaff.findOne({where: {email}});
        if(existingUser){
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_num: phoneNumber,
            role: role,
            center_id: centerId || null, // Handle case where centerId might be empty
            password: hashedPassword
        };
        
        console.log('Creating user with data:', userData);
        
        const newUser = await MedicalStaff.create(userData);
        console.log('User created successfully:', newUser.toJSON());
        
        return {success: true, message: 'User registered successfully'};
    }catch(error){
        console.error('Error registering user:', error);
        throw new Error('Failed to register user');
    }
};

export const getAllDonationCenters = async () => {
    try {
        const centers = await DonationCenter.findAll({
            attributes: ['center_id', 'name', 'city'],
            order: [['name', 'ASC']]
        });
        return centers;
    } catch (error) {
        console.error('Error fetching donation centers:', error);
        throw new Error('Failed to fetch donation centers');
    }
};

export const authenticateUser = async (email, password) => {
    try{
        const user = await MedicalStaff.findOne({where: {email}});
        if(!user){
            throw new Error('User not found');
        }
        const valid = await bcrypt.compare(password, user.password);
        if(!valid){
            throw new Error('Invalid credentials');
        }
        // Include center_id and role in the JWT payload
        const token = jwt.sign({email, center_id: user.center_id, role: user.role}, JWT_SECRET, {expiresIn: '1h'});
        return {success: true, message: 'Login successful', token};
    }catch(error){
        console.error('Error authenticating user:', error);
        throw new Error('Failed to authenticate user');
    }
};
