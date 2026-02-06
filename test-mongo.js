const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('\n=== MongoDB Connection Diagnostics ===\n');

  const srvUri = process.env.MONGO_SRV_URI;
  const directUri = process.env.MONGO_URI;

  // Test SRV URI
  if (srvUri) {
    console.log('Testing SRV URI:', srvUri);
    try {
      const client = new MongoClient(srvUri, { 
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await client.connect();
      console.log('✅ SRV Connection Successful!\n');
      await client.close();
      return;
    } catch (err) {
      console.log('❌ SRV Connection Failed:', err.message, '\n');
    }
  }

  // Test Direct URI
  if (directUri) {
    console.log('Testing Direct URI:', directUri);
    try {
      const client = new MongoClient(directUri, { 
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await client.connect();
      console.log('✅ Direct Connection Successful!\n');
      const db = client.db();
      const collections = await db.listCollections().toArray();
      console.log('Collections in database:', collections.map(c => c.name));
      await client.close();
      return;
    } catch (err) {
      console.log('❌ Direct Connection Failed:', err.message, '\n');
    }
  }

  console.log('❌ No connection URIs found in .env\n');
}

testConnection().catch(console.error);
