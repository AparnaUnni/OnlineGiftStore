import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  imageSrc: String,
  imageAlt: String,
  href: String,
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
