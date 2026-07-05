import mongoose from "mongoose";

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "news_forge" });
    console.log("Database connect Successfully");
  } catch (error) {
    console.log("Database connection error", error);
    throw error;
  }
};

export default conn;
