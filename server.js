require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");

const app = express();

// Đọc dữ liệu JSON từ request
app.use(express.json());

// Route
app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Product API is healthy"
    });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(
                `Server running at http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(error);
    });