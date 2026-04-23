// Database seeding script for development
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthai';

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = mongoose.connection.db;
    
    console.log('\n🌱 Seeding database with sample data...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('conversations').deleteMany({});
    await db.collection('reports').deleteMany({});
    
    // Create sample admin user
    console.log('👤 Creating sample admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      organizationCode: 'ADMIN2024',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin user created (email: admin@example.com, password: admin123)');
    
    // Create sample regular user
    console.log('👤 Creating sample regular user...');
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await db.collection('users').insertOne({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      phone: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Regular user created (email: user@example.com, password: user123)');
    
    // Create sample conversation
    console.log('💬 Creating sample conversation...');
    await db.collection('conversations').insertOne({
      userId: regularUser.insertedId,
      userName: 'John Doe',
      userEmail: 'user@example.com',
      messages: [
        {
          sender: 'user',
          content: 'I have a fever and headache',
          timestamp: new Date(),
        },
        {
          sender: 'bot',
          content: 'For fever, I recommend: 1) Rest and stay hydrated, 2) Take acetaminophen or ibuprofen as directed, 3) Monitor your temperature. If it persists above 103°F or lasts more than 3 days, please seek medical attention.',
          timestamp: new Date(),
        },
      ],
      status: 'active',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Sample conversation created');
    
    // Create sample reports
    console.log('📋 Creating sample reports...');
    await db.collection('reports').insertMany([
      {
        userId: regularUser.insertedId,
        userName: 'John Doe',
        userEmail: 'user@example.com',
        title: 'Flu Outbreak in Downtown Area',
        description: 'Multiple cases of flu-like symptoms reported in the downtown district.',
        category: 'Respiratory',
        severity: 'high',
        status: 'investigating',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Downtown, New York',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: regularUser.insertedId,
        userName: 'John Doe',
        userEmail: 'user@example.com',
        title: 'Food Poisoning Cases',
        description: 'Several reports of food poisoning from a local restaurant.',
        category: 'Gastrointestinal',
        severity: 'medium',
        status: 'pending',
        location: {
          latitude: 40.7580,
          longitude: -73.9855,
          address: 'Times Square, New York',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✅ Sample reports created');
    
    console.log('\n✨ Database seeded successfully!');
    console.log('\n📝 Sample Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123');
    console.log('\n📌 Next steps:');
    console.log('1. Run: pnpm dev');
    console.log('2. Visit: http://localhost:3000/login');
    console.log('3. Use the credentials above to login\n');
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
