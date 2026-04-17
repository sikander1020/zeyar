import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Use a cached connection in development to avoid too many connections
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; lastError?: Error };
}

const cache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB() {
  // Check if cached connection is still alive
  if (cache.conn) {
    try {
      // Verify connection is active
      if (cache.conn.connection.readyState === 1) {
        return cache.conn;
      }
      // Connection dropped, clear cache
      console.warn('Cached MongoDB connection died, reconnecting...');
      cache.conn = null;
      cache.promise = null;
    } catch (err) {
      console.error('Error checking MongoDB connection:', err);
      cache.conn = null;
      cache.promise = null;
    }
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { 
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 5,
    }).catch((err) => {
      cache.lastError = err;
      cache.promise = null;
      throw err;
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
}
