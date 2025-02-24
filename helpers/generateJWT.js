import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateJWT = (employeeId, employeeName) => {
    const token = jwt.sign({ employeeId, employeeName },
        process.env.SECRET_KEY || 'secretkey123',
        { expiresIn: '3d' }
    )

    return token;
}