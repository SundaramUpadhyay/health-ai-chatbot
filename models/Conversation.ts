import mongoose, { Schema, models } from 'mongoose';

export interface IMessage {
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface IConversation {
  _id: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  messages: IMessage[];
  status: 'active' | 'closed' | 'archived';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new Schema<IConversation>(
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
    messages: [messageSchema],
    status: {
      type: String,
      enum: ['active', 'closed', 'archived'],
      default: 'active',
    },
    category: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
