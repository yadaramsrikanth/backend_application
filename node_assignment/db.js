require("dotenv").config()
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URL
const client = new MongoClient(uri);
const dbName = 'swift';

async function connectDB() {
  await client.connect();
  console.log('MongoDB connected');
  return client.db(dbName);
}

module.exports = connectDB;
