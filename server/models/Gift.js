// server/models/Gift.js
import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema({
  name: String,
  href: String,
  price: Number,
  imageSrc: String,
  imageAlt: String,
  inStock: Boolean,
  category: String, // "birthday", "anniversary", ...
});

export default mongoose.models.Gift ||
  mongoose.model("Gift", GiftSchema);
