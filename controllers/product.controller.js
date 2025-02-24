import { products } from "../db/models/product.model.js";
import createError from "http-errors";
import { deals } from "../db/models/deal.model.js";

export const getProducts = async (req, res, next) => {
    try {
        const products_ = await products.find({}, '_id name wholesalePrice retailPrice').sort({ updatedAt: -1 });
        res.json(products_);
    } catch (error) {
        next(error);
    }
}

export const getProductById = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product_ = await products.findById(productId, 'name wholesalePrice retailPrice description');
        res.json(product_); 
    } catch (error) {
        next(createError(404, 'Requested resourse cannot be found'));
    } 
}

export const addProduct = async (req, res, next) => {
    const productData = req.body;
    try {
        await products.create(productData);
        res.status(201).json({});
    } catch (error) {
        error.status = 400;
        next(error);
    }    
}

export const updateProduct = async (req, res, next) => {
    const updatedData = req.body;
    const productId = req.params.id;

    try {
        const product = await products.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        Object.assign(product, updatedData);

        await product.save();

        res.sendStatus(204);

    } catch (error) {
        error.status = 400;
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    const productId = req.params.id;

    try {
        const existingDeal = await deals.findOne({ 'products.product': productId });
        
        if (existingDeal) {
            next(createError(409, 'Cannot delete this product because it is used in deals.'));
        } else {
            await products.deleteOne({_id: productId});
            res.sendStatus(204);
        }
    } catch (error) {
        next(createError(404, 'Requested resourse cannot be found'));
    } 
}