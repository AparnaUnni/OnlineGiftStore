import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { dbConnect } from "./db.js";
import Category from "./models/Category.js";
import Gift from "./models/Gift.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());  // ADD this too

// Test route first
app.get("/api/test", (req, res) => {
  res.json({ 
    mongodbUri: !!process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing",
    message: "Server working!"
  });
});

// // ADD THIS - for home page
// app.get("/api/categories", (req, res) => {
//   const apiCategories = categories.map(cat => ({
//     id: cat.id,
//     name: cat.name,
//     description: cat.description,
//     imageSrc: cat.imageSrc,
//     imageAlt: cat.imageAlt,
//     href: cat.href
//   }));
//   res.json(apiCategories);
// });

// List of categories for homepage
app.get("/api/categories", async (req, res) => {
  try {
    await dbConnect();
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gifts route
app.get("/api/gifts/:type", async (req, res) => {
  const { type } = req.params;
  try {
    await dbConnect();
    const category = await Category.findOne({ slug: type }).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });
    
    const items = await Gift.find({ category: type }).lean();
    
    res.json({
      title: `${category.name} Gifts`,
      description: category.description,
      items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
