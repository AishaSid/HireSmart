import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  downloads: { type: Number, default: 0 },
  htmlContent: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Template || mongoose.model('Template', templateSchema);