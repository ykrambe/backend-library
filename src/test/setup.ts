import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
let cacheApp: any;

declare global {
  var getApp: () => Promise<any>;
}

beforeAll(async () => {
  try {
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error('Error initializing MongoDB Memory Server:', err);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    await mongo.stop();
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}, 10000);
