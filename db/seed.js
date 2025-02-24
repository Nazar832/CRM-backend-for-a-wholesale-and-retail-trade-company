import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { employees } from './models/employee.model.js';
import { products } from './models/product.model.js';
import { buyers } from './models/buyer.model.js';
import { deals } from './models/deal.model.js';
import { connectToDB } from "./connection.js";
import { generateInvoice } from "../helpers/generateInvoice.js";

const seedDatabase = async () => {
    await connectToDB()
    .catch((error) => {
        console.log('Failed to connect to the database!');
        console.log(error);
    });

    await employees.deleteMany({});
    await products.deleteMany({});
    await buyers.deleteMany({});
    await deals.deleteMany({});

    // Add default employee
    const hashedPassword = await bcrypt.hash('securepassword', 7);
    await employees.create({ email: 'employee@company.com', password: hashedPassword });
    console.log('Employee created');

    // Add products
    const products_ = [
        { name: 'Laptop', wholesalePrice: 800, retailPrice: 1000, description: 'High-performance laptop' },
        { name: 'Smartphone', wholesalePrice: 400, retailPrice: 500, description: 'Latest smartphone model' },
        { name: 'Monitor', wholesalePrice: 150, retailPrice: 200, description: 'IPS monitor with high resolution' },
        { name: 'Mouse', wholesalePrice: 20, retailPrice: 30, description: 'Wireless mouse' },
        { name: 'Keyboard', wholesalePrice: 40, retailPrice: 60, description: 'Mechanical keyboard' },
    ];
    const insertedProducts = await products.insertMany(products_);
    console.log('Products added');

    // Add buyers
    const buyers_ = [
        { name: 'Company A', phoneNumber: '+11234567890', contactPerson: 'John Smith', address: 'New York, 5th Avenue, 10' },
        { name: 'Company B', phoneNumber: '+18434567890', contactPerson: 'Emily Johnson', address: 'Los Angeles, Sunset Blvd, 20' },
        { name: 'Company C', phoneNumber: '+13123456789', contactPerson: 'Michael Brown', address: 'Chicago, Michigan Ave, 30' },
        { name: 'Company D', phoneNumber: '+14123456789', contactPerson: 'Sarah Wilson', address: 'Houston, Main St, 40' },
        { name: 'Company E', phoneNumber: '+15123456789', contactPerson: 'David Miller', address: 'San Francisco, Market St, 50' },
    ];
    const insertedBuyers = await buyers.insertMany(buyers_);
    console.log('Buyers added');

    // Add deals
    const deals_ = [
        {
            products: [{ product: insertedProducts[0]._id, amount: 5 }, { product: insertedProducts[1]._id, amount: 2 }],
            buyer: insertedBuyers[0]._id,
            wholesale: false,
            totalPrice: 5000,
            status: 'unpaid',
        },
        {
            products: [{ product: insertedProducts[2]._id, amount: 150 }, { product: insertedProducts[3]._id, amount: 100 }],
            buyer: insertedBuyers[1]._id,
            wholesale: true,
            totalPrice: 290,
            status: 'paid',
        },
        {
            products: [{ product: insertedProducts[4]._id, amount: 10 }],
            buyer: insertedBuyers[2]._id,
            wholesale: false,
            totalPrice: 600,
            status: 'cancelled',
        },
    ];
    await deals.insertMany(deals_);
    console.log('Deals added');

    const dealsInfo = await deals.find({}).populate('buyer').populate({
        path: 'products.product',
        select: 'name wholesalePrice retailPrice',
    })
    .lean();

    dealsInfo.forEach(dealInfo => generateInvoice(dealInfo));
    console.log('Invoices added!');

    console.log('Initial data successfully added!');

    mongoose.connection.close();
};

seedDatabase();
