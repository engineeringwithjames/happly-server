import express, {Express, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import admin from "firebase-admin";

const serviceAccount = require("./serviceAccountKey.json") ;

const app: Express = express();
const port = 8081;


app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getAllUsers = async () => {
    try {
        const userRef = db.collection('users')
        const userSnapshot = await userRef.get()

        const users: any = [];
        userSnapshot.forEach((doc: any) => {
            users.push(doc.data())
        })

        // Process the list of users
        console.log("List of users: ", users)
        return users
    } catch (e) {
        console.log(e)
    }
}

// Define a simple route
app.get('/', (req: Request, res: Response) => {
    getAllUsers()
    res.send('Hello, this is your Node.js server with TypeScript!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
