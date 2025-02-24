import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = async (deal) => {
    return new Promise((resolve, reject) => {
        try {
            const invoiceFileName = `invoice_${deal._id}.pdf`;
            const invoicePath = path.join('invoices', invoiceFileName);
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(invoicePath);

            doc.pipe(stream);

            doc.fontSize(18).text(`Invoice`, { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text(`Buyer: ${deal.buyer.name}`);
            doc.text(`Contact: ${deal.buyer.contactPerson}, ${deal.buyer.phoneNumber}`);
            doc.text(`Address: ${deal.buyer.address}`);
            doc.moveDown();

            doc.text('Products:', { underline: true });
            deal.products.forEach((item, index) => {
                doc.text(`${index + 1}. ${item.product.name} ($${deal.isWholesale ? item.product.wholesalePrice : item.product.retailPrice}) - ${item.amount} pcs`);
            });

            doc.moveDown();
            doc.text(`Total Price: $${deal.totalPrice}`, { bold: true });
            doc.text(`Status: ${deal.status}`);
            doc.text(`Wholesale: ${deal.isWholesale ? 'Yes' : 'No'}`);

            doc.end();

            stream.on('finish', () => resolve());
            stream.on('error', (err) => reject(err));
        } catch (error) {
            reject(error);
        }
    });
};
