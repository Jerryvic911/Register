import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";


dotenv.config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;

app.get("/", (req, res) => {
  return res.status(200).send("Hello World");
});

app.use("/api/auth", authRoutes);



if (!mongoDBURL) {
  console.error("MONGODB_URL is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => { 
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

