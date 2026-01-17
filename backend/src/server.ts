import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import articleRoutes from "./routes/articleRoutes";

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);

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
