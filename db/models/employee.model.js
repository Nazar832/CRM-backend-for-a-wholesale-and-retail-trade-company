import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        minlength: [5, 'Email must be at least 2 characters long'],
        maxlength: [255, 'Email must be at most 255 characters long'],
        unique: [true, 'There already exists a user with such email'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [2, 'Password must be at least 2 characters long'],
    },
}, {
    versionKey: false,
});

export const employees = mongoose.model('Employee', employeeSchema);