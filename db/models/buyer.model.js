import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: [true, 'There already exists a user with such phone number'],
        match: [/^\+?[0-9]{11,12}$/, 'Invalid phone number format'],
    },
    contactPerson: {
        type: String,
        required: [true, 'Contact person is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [5, 'Address must be at least 5 characters long'],
    },
}, {
    timestamps: true,
    versionKey: false,
});

export const buyers = mongoose.model('Buyer', buyerSchema);