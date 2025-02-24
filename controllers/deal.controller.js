import { deals } from "../db/models/deal.model.js";
import { findBuyer, getProductIds } from "../helpers/deals-helpers.js";

export const getDeals = async (req, res, next) => {
    try {
        const deals_ = await deals.find({})
        .sort({ updatedAt: -1 })
        .populate({
            path: 'buyer',
            select: 'name phoneNumber'
        })
        .populate({
            path: 'products.product',
            select: 'name'
        })
        .lean();

        const formattedDeals = deals_.map(deal => ({
            _id: deal._id,
            products: deal.products.map(p => ({
                product: p.product.name,
                amount: p.amount
            })),
            buyerName: deal.buyer.name,
            contactPersonPhone: deal.buyer.phoneNumber,
            wholesale: deal.wholesale,
            totalPrice: deal.totalPrice,
            status: deal.status,
        }));

        res.json(formattedDeals);
    } catch (error) {
        next(error);
    }
}

export const getDealById = async (req, res, next) => {
    try {
        const dealId = req.params.id;
        const deal_ = await deals.findById(dealId)
            .populate({
                path: 'buyer',
            })
            .populate({
                path: 'products.product',
                select: 'name'
            })
            .lean();

        if (!deal_) return res.status(404).json({ error: "Deal not found" });

        const formattedDeals = [deal_].map(deal => ({
            _id: deal._id,
            products: deal.products.map(p => ({
                product: p.product.name,
                amount: p.amount
            })),
            buyer: deal.buyer,
            wholesale: deal.wholesale,
            totalPrice: deal.totalPrice,
            status: deal.status,
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
        }))[0];

        res.json(formattedDeals);
    } catch (error) {
        next(error);
    }
}

export const addDeal = async (req, res, next) => {
    try {
        const { buyer, buyerPhone, status, products: products_, totalPrice, isWholesale } = req.body;
        const buyerData = await findBuyer(buyer, buyerPhone);
        const productsWithIds = await getProductIds(products_);

        await deals.create({
            buyer: buyerData._id,
            status,
            products: productsWithIds,
            totalPrice,
            wholesale: isWholesale,
        });

        res.status(201).json({ message: 'Deal created successfully' });
    } catch (error) {
        next(error);
    }
}

export const updateDeal = async (req, res, next) => {
    try {
        const { buyer, buyerPhone, status, products: products_, totalPrice, isWholesale } = req.body;
        const existingDeal = await deals.findById(req.params.id);
        if (!existingDeal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        
        const buyerData = await findBuyer(buyer, buyerPhone);
        const productIds = await getProductIds(products_);

        Object.assign(existingDeal, {
            buyer: buyerData._id,
            status,
            products: productIds,
            totalPrice,
            wholesale: isWholesale,
        });

        await existingDeal.save();
        res.status(200).json({ message: 'Deal updated successfully' });
    } catch (error) {
        next(error);
    }
}