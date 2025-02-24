import createError from "http-errors";
import { employees } from "../db/models/employee.model.js";
import bcrypt from 'bcrypt';
import { generateJWT } from "../helpers/generateJWT.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const employeeByEmail = await employees.findOne({ email });
        if (!employeeByEmail) {
            return next(createError(400, 'There is no such user'));
        }

        const employeePassword = employeeByEmail.password;

        if (await bcrypt.compare(password, employeePassword)) {
            const token = generateJWT(employeeByEmail._id, employeeByEmail.name);
            return res.json({ token });
        }
    } catch (error) {
        next(error);
    }

    next(createError(400, 'There is no such user'));
}