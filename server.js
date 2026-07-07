import { config } from "dotenv";
config("./.env");

import express from "express";
import morgan from "morgan";
import conn from "./src/Config/db.js";
import authRouter from "./src/Routes/AuthRoutes.js";
import categoryRouter from "./src/Routes/CategoryRoutes.js";
import postRouter from "./src/Routes/PostRoutes.js";
import userRouter from "./src/Routes/UserRoutes.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => res.send("<h1>NewsForge Backend</h1>"));

app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);

// Start Server
const startServer = async () => {
  try {
    await conn();
    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Something Went Wrong ", error);
  }
};

startServer();
