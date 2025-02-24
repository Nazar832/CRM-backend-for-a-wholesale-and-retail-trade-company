import { buyers } from "../db/models/buyer.model.js";
import { products } from "../db/models/product.model.js";

export const findBuyer = async (buyer, buyerPhone) => {
    const buyerData = await buyers.findOne({ name: buyer, phoneNumber: buyerPhone });
    if (!buyerData) {
        const error = new Error('Buyer not found');
        error.status = 400;
        throw error;
    }
    return buyerData;
};

export const getProductIds = async (products_) => {
    const productsWithIds = [];
    for (const p of products_) {
        const product = await products.findOne({ name: p.product });
        if (!product) {
            const error = new Error(`Product not found: ${p.product}`);
            error.status = 400;
            throw error;
        }
        productsWithIds.push({ product: product._id, amount: p.amount });
    }
    return productsWithIds;
};