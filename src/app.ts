import express, { type Application } from "express";
import routes from "./routes";
import { pool } from "./config/database";

const app: Application = express();

app.use(express.json());

app.use("/", routes);

export default app;
