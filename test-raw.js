const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testRaw() {
  console.log('\n=== Raw MongoDB Client Test ===\n');

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('❌ MONGO_URI not set in .env');
    return;
  }

  console.log('URI:', uri.replace(/:[^@]+@/, ':****@'));
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      tls: true,
      retryWrites: false,
    });

    console.log('\nConnecting...');
    await client.connect();
    
    console.log('✅ Connected!');
    
    // Try a simple ping
    const adminDb = client.db('admin');
    const pingResult = await adminDb.admin().ping();
    console.log('✅ Ping successful:', pingResult);
    
    // List databases
    const databases = await adminDb.admin().listDatabases();
    console.log('Databases:', databases.databases.map(d => d.name).slice(0, 5));
    
    await client.close();
    process.exit(0);
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('\nFull error:');
    console.log(err);
    process.exit(1);
  }
}

testRaw();
