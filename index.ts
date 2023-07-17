import express, { Express, Request, Response } from "express";
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const port = 8000;

const app: Express = express();
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO FROM EXPRESS + TS!!!!");
});

app.get("/hi", (req: Request, res: Response) => {
  console.log('hey there')

  res.send("Hey!!");
});

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
