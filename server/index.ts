import fs from "fs";
import express from "express";
import http from "http";
import http2 from "http2";
import express2 from "http2-express-bridge";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

let app = null;
const http2Options = { key: fs.readFileSync("./certs/key.pem"), cert: fs.readFileSync("./certs/cert.pem"), allowHTTP1: true };
let server = null;

if (process.env.NODE_ENV === "production") {
    // HTTP/2 in production
    app = express2(express);
    server = http2.createSecureServer(http2Options, app);
} else {
    // HTTP/1 for local development
    app = express();
    server = http.createServer(app);
}

app.use(cors({ credentials: true, origin: true })); //specify origin if you want to allow only certain domain to communicate with this server
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.status(200).send({ message: "Example Api" });
})

// Routes
import authRoute from "./routes/authRoute";
import pageRoute from "./routes/pageRoute";
import uploadRoute from "./routes/uploadRoute";


app.use("/auth", authRoute);
app.use("/pages", pageRoute);
app.use("/upload", uploadRoute);

server.listen(process.env.PORT, () => { console.log(`Web ${process.env.NODE_ENV === "production" ? "h2" : "h1"} server is running on ${process.env.PORT}`) })

// Database
import pg from "pg";
import { createTables } from "./sql/tables";
const { Pool } = pg;
export const db = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME || "postgres",
    port: process.env.DB_PORT as number | undefined || 5432,//5432 is default postgres
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",

})

db.connect().then(async () => {
    console.log("Database connected");
    db.query(createTables).then(() => console.log("Tables were created")).catch(console.error);
}).catch(console.error);
