import mongoose from "mongoose";
import 'dotenv/config';

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'CRM_db';

async function connectToDB() {
    try {
        await mongoose.connect(`${dbUrl}/${dbName}`);
    } catch (error) {
        throw error;
    }
}

export { connectToDB };