const express = require("express");
const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);
require("dotenv").config();
const app = express();
const connectDB = require("./db/connect");
const productRouter = require("./routes/products");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.get("/", (req, res) => {
	res.send('<h1>Store Api </h1><a href="/api/v1/products">Products route</a>');
});
app.use("/api/v1/products", productRouter);

// app.get("/", (req, res) => {
// console.log("Hello World!!!!!!");
// });
app.use(notFoundMiddleware);
app.use(errorMiddleware);
const start = async () => {
	try {
		await connectDB(process.env.MongoUri);
		app.listen(6000, () => {
			console.log("Sever is working");
		});
	} catch (error) {
		console.log("Connection error");
	}
};

start();
