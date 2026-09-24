const express = require("express");
const router = express.Router();

const Product = require("../models/Product");


// ==============================
// GET - Lấy tất cả sản phẩm
// ==============================
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// ==============================
// GET - Lấy sản phẩm theo pid
// ==============================
router.get("/:pid", async (req, res) => {
    try {

        const product = await Product.findOne({
            pid: req.params.pid
        });

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.status(200).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// ==============================
// POST - Thêm sản phẩm
// ==============================
router.post("/", async (req, res) => {

    try {

        const product = new Product({
            pid: req.body.pid,
            pname: req.body.pname,
            price: req.body.price,
            quantity: req.body.quantity
        });

        const newProduct = await product.save();

        res.status(201).json(newProduct);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// ==============================
// PUT - Cập nhật sản phẩm
// ==============================
router.put("/:pid", async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { pid: req.params.pid },
            {
                pname: req.body.pname,
                price: req.body.price,
                quantity: req.body.quantity
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// ==============================
// DELETE - Xóa sản phẩm
// ==============================
router.delete("/:pid", async (req, res) => {

    try {

        const product = await Product.findOneAndDelete({
            pid: req.params.pid
        });

        if (!product) {

            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });

        }

        res.status(200).json({
            message: "Xóa sản phẩm thành công"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports = router;