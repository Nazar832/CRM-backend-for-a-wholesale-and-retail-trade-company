import express from "express";
import { connectToDB } from "./db/connection.js";
import { buyersRouter } from "./routes/buyers.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { dealsRouter } from "./routes/deals.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { invoicesRouter } from "./routes/invoices.routes.js";
import { checkAuth } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/errors.middleware.js";
import cors from "cors";
import 'dotenv/config';

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use("/invoices", express.static("invoices"));
app.use('/login', authRouter);
app.use(checkAuth);
app.use('/buyers', buyersRouter);
app.use('/deals', dealsRouter);
app.use('/products', productsRouter);
app.use('/invoices', invoicesRouter);

app.use(errorHandler);

await connectToDB()
.then(app.listen(port, (req, res) => {
    console.log(`Server is listening on http://localhost:${port}`);
}))
.catch((error) => {
    console.log('Failed to connect to the database!');
    console.log(error);
});
