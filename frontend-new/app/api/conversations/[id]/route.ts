import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { verifyToken } from '@/lib/jwt';

// Get a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const conversation = await Conversation.findById(params.id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check authorization
    if (decoded.role !== 'admin' && conversation.userId.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ conversation }, { status: 200 });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a message to conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { message, sender } = body;

    const conversation = await Conversation.findById(params.id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check authorization
    if (decoded.role !== 'admin' && conversation.userId.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    conversation.messages.push({
      sender: sender || 'user',
      content: message,
      timestamp: new Date(),
    });

    await conversation.save();

    // Simulate AI response
    if (sender === 'user') {
      setTimeout(async () => {
        const aiResponse = generateAIResponse(message);
        conversation.messages.push({
          sender: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        });
        await conversation.save();
      }, 1000);
    }

    return NextResponse.json(
      { message: 'Message added', conversation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Add message error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update conversation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status, priority } = body;

    const conversation = await Conversation.findById(params.id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (status) conversation.status = status;
    if (priority) conversation.priority = priority;

    await conversation.save();

    return NextResponse.json(
      { message: 'Conversation updated', conversation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate AI responses
function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('symptom') || lowerMessage.includes('sick') || lowerMessage.includes('pain')) {
    return "I understand you're experiencing symptoms. Can you describe them in more detail? When did they start?";
  } else if (lowerMessage.includes('fever')) {
    return "For fever, I recommend: 1) Rest and stay hydrated, 2) Take acetaminophen or ibuprofen as directed, 3) Monitor your temperature. If it persists above 103°F or lasts more than 3 days, please seek medical attention.";
  } else if (lowerMessage.includes('headache')) {
    return "For headaches, try: 1) Rest in a quiet, dark room, 2) Stay hydrated, 3) Apply a cold compress. If severe or persistent, please consult a healthcare provider.";
  } else if (lowerMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  } else {
    return "I'm here to help with your health concerns. Could you provide more details about what you're experiencing?";
  }
}
