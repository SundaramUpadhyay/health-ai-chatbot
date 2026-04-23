import mongoose, { Schema, models } from 'mongoose';

export interface IReport {
  _id: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'closed'],
      default: 'pending',
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    attachments: [String],
  },
  {
    timestamps: true,
  }
);

const Report = models.Report || mongoose.model<IReport>('Report', reportSchema);

export default Report;
