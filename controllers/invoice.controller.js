import { generateInvoice } from "../helpers/generateInvoice.js";
import fs from 'fs';
import path from 'path';
import { deals } from "../db/models/deal.model.js";

export const returnInvoice = async (req, res, next) => {
    const dealId = req.params.dealId;

    const projectRoot = process.cwd();
    const invoicesFolrderFullPath = path.join(projectRoot, 'invoices');
    const ivoiceFullPath = path.join(invoicesFolrderFullPath,`invoice_${dealId}.pdf`);
   
    try {
        if (fs.existsSync(ivoiceFullPath)) {      
            res.download(ivoiceFullPath);
        } else {
           const dealInfo = await deals.findById(dealId).populate('buyer').populate({
               path: 'products.product',
                   select: 'name wholesalePrice retailPrice',
               })
               .lean();
       
           await generateInvoice(dealInfo);
           res.download(ivoiceFullPath);
        }
    } catch (error) {
        next(error);
    }
}