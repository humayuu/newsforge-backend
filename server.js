import { config } from "dotenv";
config("./.env");

import express from "express";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => res.send("<h1>NewsForge Backend</h1>"));

// Start Server
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
