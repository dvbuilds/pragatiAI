import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    description: { type: String, required: true, trim: true, maxlength: 1000 },

    type: {
      type: String,
      enum: ['pothole', 'lighting', 'sanitation', 'noise', 'other'],
      default: 'other',
      index: true,
    },
    department: { type: String, default: 'Department of Public Works' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },

    photo: {
      url: { type: String },
      publicId: { type: String },
    },

    location: {
      // GeoJSON point for accurate geospatial queries
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      address: { type: String, trim: true },
    },

    status: {
      type: String,
      enum: ['active', 'in_review', 'resolved'],
      default: 'active',
      index: true,
    },

    aiAnalysis: {
      category: String,
      confidence: Number,
      rawReasoning: String,
    },
  },
  { timestamps: true }
);

issueSchema.index({ location: '2dsphere' });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
