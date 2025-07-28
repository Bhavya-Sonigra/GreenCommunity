import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Debug: Log environment variable loading
console.log('🔍 Debug: MONGO_URI loaded?', !!process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
} else {
  console.log('✅ MONGO_URI found in environment variables');
}

// Database configurations
const DB_CONFIG = {
  AUTH_DB: 'greencommunity-auth',
  USER_INFO_DB: 'greencommunity-user-info',
  MARKETPLACE_DB: 'greencommunity-marketplace', 
  COMMUNITY_DB: 'greencommunity-community',
  ANALYTICS_DB: 'greencommunity-analytics'
};

// Store database connections
const connections = {};

/**
 * Get or create a connection to a specific database
 * @param {string} dbName - Database name from DB_CONFIG
 * @returns {mongoose.Connection} Database connection
 */
export const getConnection = async (dbName) => {
  if (!DB_CONFIG[dbName]) {
    throw new Error(`Database configuration not found for: ${dbName}`);
  }

  const dbFullName = DB_CONFIG[dbName];
  
  if (connections[dbFullName]) {
    return connections[dbFullName];
  }

  try {
    const connection = await mongoose.createConnection(process.env.MONGO_URI, {
      dbName: dbFullName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    connections[dbFullName] = connection;
    console.log(`✅ MongoDB connected to ${dbFullName}`);
    
    // Handle connection events
    connection.on('error', (error) => {
      console.error(`❌ MongoDB error in ${dbFullName}:`, error);
    });

    connection.on('disconnected', () => {
      console.log(`🔌 MongoDB disconnected from ${dbFullName}`);
      delete connections[dbFullName];
    });

    return connection;
  } catch (error) {
    console.error(`❌ MongoDB connection error for ${dbFullName}:`, error.message);
    throw error;
  }
};

/**
 * Connect to all required databases
 */
export const connectAllDatabases = async () => {
  try {
    // First, connect mongoose default connection to auth database
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: DB_CONFIG.AUTH_DB,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ Default connection established to ${DB_CONFIG.AUTH_DB}`);
    
    // Connect to user info database
    await getConnection('USER_INFO_DB');
    
    // Connect to marketplace database
    await getConnection('MARKETPLACE_DB');
    
    // Connect to community database  
    await getConnection('COMMUNITY_DB');
    
    console.log('🎉 All databases connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to databases:', error);
    process.exit(1);
  }
};

/**
 * Close all database connections
 */
export const closeAllConnections = async () => {
  try {
    const closePromises = Object.values(connections).map(conn => conn.close());
    await Promise.all(closePromises);
    console.log('🔒 All database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

// Export database names for easy reference
export const DB_NAMES = DB_CONFIG;

export default {
  getConnection,
  connectAllDatabases,
  closeAllConnections,
  DB_NAMES
};
