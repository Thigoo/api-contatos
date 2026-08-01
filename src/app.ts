import express, { type Application } from "express";
import routes from "./routes";

const app: Application = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    message: "OK",
  });
});

app.use("/", routes);

export default app;
