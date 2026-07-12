import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    issueCategory: {
      type: String,
      enum: ['waterlogging', 'inefficient_service', 'crime_rate'],
      required: true,
    },
    area: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true, maxlength: 1500 },

    generatedSubject: { type: String, required: true },
    generatedBody: { type: String, required: true },

    recipientEmail: { type: String, trim: true },
    status: {
      type: String,
      enum: ['drafted', 'sent', 'failed'],
      default: 'drafted',
    },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
