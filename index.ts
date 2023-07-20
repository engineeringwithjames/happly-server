import express, { Express, Request, Response } from "express";
import {FIREBASE_APP, FIREBASE_DB} from "./db/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore'


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

const getHabitById = async (req: Request, res: Response) => {
    const response = await getDoc(
        doc(FIREBASE_DB, 'habits', 'habit-Rg0mbzuxdFVhnzK_')
    )

    res.send(response.data());
}

app.get("/hi", getHabitById);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
