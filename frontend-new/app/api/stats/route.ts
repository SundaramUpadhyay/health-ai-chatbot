import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Conversation from '@/models/Conversation';
import Report from '@/models/Report';
import { verifyToken } from '@/lib/jwt';

// Get dashboard statistics
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

    if (decoded.role === 'admin') {
      // Admin statistics
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalConversations = await Conversation.countDocuments();
      const activeConversations = await Conversation.countDocuments({ status: 'active' });
      const totalReports = await Report.countDocuments();
      const pendingReports = await Report.countDocuments({ status: 'pending' });
      const criticalReports = await Report.countDocuments({ severity: 'critical' });

      return NextResponse.json({
        stats: {
          totalUsers,
          totalConversations,
          activeConversations,
          totalReports,
          pendingReports,
          criticalReports,
        },
      }, { status: 200 });
    } else {
      // User statistics
      const userConversations = await Conversation.countDocuments({ userId: decoded.userId });
      const activeChats = await Conversation.countDocuments({ 
        userId: decoded.userId, 
        status: 'active' 
      });
      const userReports = await Report.countDocuments({ userId: decoded.userId });

      return NextResponse.json({
        stats: {
          totalConversations: userConversations,
          activeChats,
          totalReports: userReports,
        },
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
