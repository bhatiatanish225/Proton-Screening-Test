import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db = null;

const connectDB = async (done) => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set.");
    }

    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGO_URL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    db = client.db('chatGPT');
    console.log("Connected to MongoDB");
    done();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    done(err);
  }
};

export { connectDB, db };
