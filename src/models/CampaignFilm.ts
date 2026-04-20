import mongoose from 'mongoose';

const campaignFilmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Cloudinary URL
  thumbnailUrl: { type: String }, // Optional Cloudinary thumbnail
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const CampaignFilm = mongoose.models.CampaignFilm || mongoose.model('CampaignFilm', campaignFilmSchema);
