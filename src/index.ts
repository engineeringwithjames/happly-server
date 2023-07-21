import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import firebase  from "firebase-admin";
import serviceAccount from "./happly-5c322-firebase-adminsdk-4ux5o-3a8d4d67a6.json";

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

firebase.initializeApp({
    credential: firebase.credentials.cert(serviceAccount),
    databaseURL: "https://happly-5c322-default-rtdb.firebaseio.com"
});

var db  = firebase.database();

const userRef = db.collection("users");

app.get('/', (req, res) => {
    // get data from firestore
    const docRef = db.collection('users').docs();
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    res.send('hello world');
})


app.listen(8080, () => {
    console.log('listening on port 3000');
})
