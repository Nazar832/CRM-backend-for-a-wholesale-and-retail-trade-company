import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
    products: { 
        type: [{
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: [true, 'Product ID is required']
            },
            amount: { 
                type: Number, 
                required: [true, 'Product amount is required'], 
                min: [1, 'Amount must be at least 1']
            },
        }],
        required: [true, 'Products array is required'],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'At least one product is required'
        }
    },
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Buyer', 
        required: [true, 'Buyer ID is required']
    },
    wholesale: {
        type: Boolean,
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0.01, 'Price must be at least 0.01'],
    },
    status: {
        type: String,
        enum: {
            values: ['unpaid', 'paid', 'cancelled'],
            message: 'Invalid status. Allowed values: unpaid, paid, cancelled'
        },
        default: 'unpaid',
    },
}, {
    timestamps: true,
    versionKey: false,
});


export const deals = mongoose.model('Deal', dealSchema);