import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import articleRoutes from "./routes/articleRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  if (req.method === "POST" || req.method === "PUT") {
    console.log(`[DEBUG] Body present: ${!!req.body}`);
  }
  next();
});

app.use("/api/articles", articleRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("SpaceBlog Backend API");
});

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "../../certs/localhost.key")),
  cert: fs.readFileSync(path.join(__dirname, "../../certs/localhost.crt")),
};

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
