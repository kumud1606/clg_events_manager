import mongoose from "mongoose";

let isConnected = false;

export default async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI is not set yet. Backend will start without a database connection.");
    return null;
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
  return mongoose.connection;
}
