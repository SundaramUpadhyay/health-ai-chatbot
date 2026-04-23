import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import { verifyToken } from '@/lib/jwt';

// Get all reports (Admin) or user's reports (User)
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

    let reports;
    if (decoded.role === 'admin') {
      // Admin can see all reports
      reports = await Report.find().sort({ createdAt: -1 });
    } else {
      // Users can only see their own reports
      reports = await Report.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new report
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
    const { title, description, category, severity, location } = body;

    const User = (await import('@/models/User')).default;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const report = await Report.create({
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
      title,
      description,
      category,
      severity: severity || 'medium',
      location,
      status: 'pending',
    });

    return NextResponse.json(
      { message: 'Report created successfully', report },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
