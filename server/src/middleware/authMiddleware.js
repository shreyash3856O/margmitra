import jwt from 'jsonwebtoken';
import { db } from '../config/memoryDB.js';

const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
            
            const user = db.users.find(u => u._id === decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found in memory db' });
            }
            
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const logistics = (req, res, next) => {
    if (req.user && (req.user.role === 'logistics' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as logistics partner' });
    }
};

export { protect, admin, logistics };
