const { MongoClient } = require('mongodb');

async function test() {
  const uri = 'mongodb://vijayraju049_db_user:Vijaya123@ac-m3smvlu-shard-00-00.p9mufas.mongodb.net:27017,ac-m3smvlu-shard-00-01.p9mufas.mongodb.net:27017,ac-m3smvlu-shard-00-02.p9mufas.mongodb.net:27017/Vijaya?replicaSet=ac-m3smvlu-shard-0&ssl=true&retryWrites=true&w=majority';
  
  console.log('Testing direct connection (no replica set requirement)...');
  try {
    const client = new MongoClient(uri, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    const admin = client.db('admin').admin();
    console.log('Connecting...');
    await admin.ping();
    console.log('✅ Ping successful!');
    await client.close();
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

test();
