export const envFile = () => {
  const pg = `PG_USER=YourUserName
PG_DB=YourDatabase
PG_PASS=YourPassword
PG_HOST=YourHost`;

  const mongo = `DB_STRING=Your Connection String`;

  return { pg, mongo };
};

export const dbConfig = () => {
  const pg = `import { Pool } from 'pg';
import 'dotenv/config';
  
const pool = new Pool({
  user: process.env.PG_USER.toString(),
  host: process.env.PG_HOST.toString(),
  database: process.env.PG_DB.toString(),
  password: process.env.PG_PASS.toString(),
  port: 5432, // Adjust if using a non-default port
});
  
      
export default pool`;

  const mongo = `import mongoose from "mongoose";
import 'dotenv/config';
  
const DB_STRING = process.env.DB || "";
  
// Connection options, including connection pooling settings
const options = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Max time a connection can remain idle before being closed
  socketTimeoutMS: 45000, // Timeout for socket inactivity
  connectTimeoutMS: 30000, // Timeout for initial connection
};
  
const connectDB = async () => {
  try {
      await mongoose.connect(DB_STRING, options);
      console.log("Connected to DB");
  } catch (error) {
      if (
        error.name === "MongoNetworkError" &&
        error.message.includes("ETIMEDOU")
      ) {
        console.error("Connection timed out: Please check your network status.");
      } else if (
        error.name === "MongoNetworkError" &&
        error.message.includes("ETIMEDOUT")
      ) {
        throw new Error("Server timed out");
      } else {
        console.error('Connection failed: {error?.message}'); //Update this line
      }
      process.exit(1); // Optionally exit the process if the connection fails
  }
};
  
export default connectDB;`;

  return { pg, mongo };
};
