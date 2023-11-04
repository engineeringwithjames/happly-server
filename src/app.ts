import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import { pushNotification, streakVerification } from "./jobs";
require("dotenv").config();

const app: Express = express();

const port = 8081;

app.use(
  cors({
    credentials: true
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Cron job to run every minute
pushNotification();
streakVerification();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World New!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
