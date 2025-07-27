import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Registration input validation middleware
export const validateRegisterInput = (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, role, centerId, password, rePassword } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !role || !password || !rePassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== rePassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    next();
};

// Login input validation middleware
export const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    next();
};

// JWT token verification middleware
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Fix: use JWT_SECRET
        req.user = decoded;
        next();
    } catch (err) {
        // Invalid or expired token
        return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    }
};

