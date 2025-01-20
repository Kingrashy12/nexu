import NodeRSA from "node-rsa";

const key = new NodeRSA({ b: 3072 });

const public_key = key.exportKey("public");
const private_key = key.exportKey("private");

export const envFile = () => {
  const pg = `NEXU_PUBLIC_KEY="${public_key}"
NEXU_PRIVATE_KEY="${private_key}"
PG_USER=YourUserName
PG_DB=YourDatabase
PG_PASS=YourPassword
PG_HOST=YourHost`;

  const mongo = `NEXU_PUBLIC_KEY="${public_key}"
NEXU_PRIVATE_KEY="${private_key}"
DB_STRING=Your Connection String`;

  const main = `NEXU_PUBLIC_KEY="${public_key}"
NEXU_PRIVATE_KEY="${private_key}"`;

  return { pg, mongo, main };
};

export const dbConfig = () => {
  const pg = `import { Pool, QueryResult, QueryResultRow } from 'pg';
  
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: 5432,
});
  
      
export const query = async (
  action: string,
  values?: unknown[]
): Promise<QueryResult<QueryResultRow> | undefined> => {
  const client = await pool.connect();
  try {
    return await client.query(action, values);
  } catch (error) {
    throw new Error("Database query failed");
  } finally {
    client.release();
  }
};
`;

  const mongo = `import mongoose from "mongoose";
  
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
