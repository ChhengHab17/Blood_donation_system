import { registerUser, authenticateUser, getAllDonationCenters } from '../services/authService.js';


export const register = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, role, centerId, password, rePassword } = req.body;
    try {
        // Validate password match
        if (password !== rePassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        
        const result = await registerUser(firstName, lastName, email, phoneNumber, role, centerId, password, rePassword);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authenticateUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export const getDonationCenters = async (req, res) => {
    try {
        const centers = await getAllDonationCenters();
        res.status(200).json({ success: true, data: centers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}