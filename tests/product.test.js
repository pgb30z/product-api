require("dotenv").config({ quiet: true });

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const Product = require("../models/Product");

beforeAll(async () => {
    console.log("Test Mongo URI:", process.env.MONGO_URI_TEST);

    await mongoose.connect(process.env.MONGO_URI_TEST, {
        serverSelectionTimeoutMS: 3000
    });
}, 10000);

beforeEach(async () => {
    await Product.deleteMany({});
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await Product.deleteMany({});
    }

    await mongoose.disconnect();
}, 10000);

describe("Product API CRUD Tests", () => {

    test("POST /api/products - Create product", async () => {
        const response = await request(app)
            .post("/api/products")
            .send({
                pid: "P001",
                pname: "Laptop Dell",
                price: 15000000,
                quantity: 10
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.pid).toBe("P001");
        expect(response.body.pname).toBe("Laptop Dell");
        expect(response.body.price).toBe(15000000);
        expect(response.body.quantity).toBe(10);
    });


    test("GET /api/products - Get all products", async () => {
        await Product.create({
            pid: "P001",
            pname: "Laptop Dell",
            price: 15000000,
            quantity: 10
        });

        const response = await request(app)
            .get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].pid).toBe("P001");
    });


    test("GET /api/products/:pid - Get product by pid", async () => {
        await Product.create({
            pid: "P002",
            pname: "Laptop HP",
            price: 12000000,
            quantity: 5
        });

        const response = await request(app)
            .get("/api/products/P002");

        expect(response.statusCode).toBe(200);
        expect(response.body.pid).toBe("P002");
        expect(response.body.pname).toBe("Laptop HP");
    });


    test("PUT /api/products/:pid - Update product", async () => {
        await Product.create({
            pid: "P003",
            pname: "Laptop Asus",
            price: 14000000,
            quantity: 8
        });

        const response = await request(app)
            .put("/api/products/P003")
            .send({
                pname: "Laptop Asus Gaming",
                price: 18000000,
                quantity: 6
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.pid).toBe("P003");
        expect(response.body.pname).toBe("Laptop Asus Gaming");
        expect(response.body.price).toBe(18000000);
        expect(response.body.quantity).toBe(6);
    });


    test("DELETE /api/products/:pid - Delete product", async () => {
        await Product.create({
            pid: "P004",
            pname: "Laptop Lenovo",
            price: 13000000,
            quantity: 7
        });

        const response = await request(app)
            .delete("/api/products/P004");

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Xóa sản phẩm thành công");

        const product = await Product.findOne({
            pid: "P004"
        });

        expect(product).toBeNull();
    });

});