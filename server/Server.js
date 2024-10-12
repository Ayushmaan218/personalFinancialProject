const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Extract the port number from the URL
const PORT = process.env.PORT ? process.env.PORT.split(':')[2] : 5000; // Default to 5000 if PORT is not defined

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
    process.env.Mongo_uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const db = mongoose.connection;
db.on("error", (e) => {
    console.error("MongoDB connection error:", e);
});
db.once("open", () => {
    console.log("MongoDB connected");
});

// Mongoose Schema and Model
const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);

// GET route to fetch all expenses
app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST route to create a new expense
app.post("/expenses", async (req, res) => {
    const { description, amount } = req.body;

    console.log("Received request:", req.body); // Log the incoming request body

    try {
        // Validation: Ensure description and amount are provided
        if (!description || typeof amount !== "number") {
            return res
                .status(400)
                .json({ message: "Description and valid amount are required." });
        }

        // Create a new expense
        const newExpense = new Expense({ description, amount });
        await newExpense.save();

        console.log("Expense saved:", newExpense); // Log the newly saved expense
        res.json(newExpense);
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log the server URL
});
