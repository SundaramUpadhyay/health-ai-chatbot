// Database setup script
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthai';

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Create indexes for better performance
    const db = mongoose.connection.db;
    
    console.log('\n📝 Creating indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ User email index created');
    
    // Conversations collection indexes
    await db.collection('conversations').createIndex({ userId: 1 });
    await db.collection('conversations').createIndex({ status: 1 });
    await db.collection('conversations').createIndex({ createdAt: -1 });
    console.log('✅ Conversation indexes created');
    
    // Reports collection indexes
    await db.collection('reports').createIndex({ userId: 1 });
    await db.collection('reports').createIndex({ status: 1 });
    await db.collection('reports').createIndex({ severity: 1 });
    await db.collection('reports').createIndex({ createdAt: -1 });
    console.log('✅ Report indexes created');
    
    console.log('\n✨ Database setup completed successfully!');
    console.log('\n📌 Next steps:');
    console.log('1. Run: pnpm dev');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Sign up as a user or admin');
    console.log('4. Start using the application!\n');
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n💡 Make sure MongoDB is running:');
    console.error('   - Windows: net start MongoDB');
    console.error('   - macOS: brew services start mongodb-community');
    console.error('   - Linux: sudo systemctl start mongod');
    console.error('\n   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas\n');
    process.exit(1);
  }
}

setupDatabase();
