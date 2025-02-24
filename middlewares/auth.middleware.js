import createError from "http-errors";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const checkAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return next(createError(401));
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY || 'secretkey123');
        next();
    } catch (error) {
        return next(createError(401));
    }
}