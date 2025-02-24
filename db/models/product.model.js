import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters long'],
        unique: [true, 'There already exists a product with such name'],
        trim: true,
    },
    wholesalePrice: {
        type: Number,
        required: [true, 'Wholesale price is required'],
        min: [0.01, 'Price must be at least 0.01'],
    },
    retailPrice: {
        type: Number,
        required: [true, 'Retail price is required'],
        min: [0.01, 'Price must be at least 0.01'],
        validate: {
            validator: function (value) {
                return value >= this.wholesalePrice;
            },
            message: 'Retail price must be greater than or equal to wholesale price',
        },
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [5, 'Description must be at least 5 characters long'] 
    }
}, {
    timestamps: true,
    versionKey: false,
});

export const products = mongoose.model('Product', productSchema);