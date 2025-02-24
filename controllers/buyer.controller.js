import { buyers } from "../db/models/buyer.model.js";
import createError from "http-errors";
import { deals } from "../db/models/deal.model.js";

export const getBuyers = async (req, res) => {
    try {
        const buyers_ = await buyers.find({}, '_id name phoneNumber contactPerson address').sort({ updatedAt: -1 });
        res.json(buyers_);
    } catch (error) {
        next(error);
    }
}

export const getBuyerById = async (req, res, next) => {
    const buyerId = req.params.id;
    try {
        const buyer = await buyers.findById(buyerId).lean();
        if (!buyer) return next(createError(404, 'Requested resourse cannot be found'));

        const deals_ = await deals.find({ buyer: buyerId })
            .populate({
                path: 'products.product',
                select: 'name'
            })
            .select('_id products wholesale totalPrice status')
            .lean();

        const formattedDeals = deals_.map(deal => ({
            ...deal,
            products: deal.products.map(p => ({
            product: p.product.name,
            amount: p.amount,
            }))
        }));

        res.json({ ...buyer, deals_: formattedDeals });
    } catch (error) {
        next(createError(404, 'Requested resourse cannot be found'));
    } 
}

export const addBuyer = async (req, res, next) => {
    const buyerData = req.body;
    try {
        await buyers.create(buyerData);
        res.status(201).json({});
    } catch (error) {
        error.status = 400;
        next(error);
    }    
}

export const updateBuyer = async (req, res, next) => {
    const updatedData = req.body;
    const buyerId = req.params.id;

    try {
        const buyer = await buyers.findById(buyerId);
        if (!buyer) return res.status(404).json({ error: "Buyer not found" });

        Object.assign(buyer, updatedData);
        await buyer.save();

        res.sendStatus(204);

    } catch (error) {
        error.status = 400;
        next(error);
    }
}

export const deleteBuyer = async (req, res, next) => {
    const buyerId = req.params.id;

    try {
        const existingDeals = await deals.findOne({ 'buyer': buyerId });
        
        if (existingDeals) {
            next(createError(409, 'Cannot delete this buyer because he has deals.'));
        } else {
            await buyers.deleteOne({_id: buyerId});
            res.sendStatus(204);
        }
    } catch (error) {
        next(createError(404, 'Requested resourse cannot be found'));
    } 
}