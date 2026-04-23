import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { verifyToken } from '@/lib/jwt';

// Get all conversations (Admin) or user's conversations (User)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    let conversations;
    if (decoded.role === 'admin') {
      // Admin can see all conversations
      conversations = await Conversation.find().sort({ updatedAt: -1 });
    } else {
      // Users can only see their own conversations
      conversations = await Conversation.find({ userId: decoded.userId }).sort({ updatedAt: -1 });
    }

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new conversation
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { message, category } = body;

    const User = (await import('@/models/User')).default;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const conversation = await Conversation.create({
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
      messages: [
        {
          sender: 'user',
          content: message,
          timestamp: new Date(),
        },
      ],
      category,
      status: 'active',
    });

    return NextResponse.json(
      { message: 'Conversation created', conversation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
