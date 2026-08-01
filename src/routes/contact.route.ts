import { Router } from "express";

const contactRouter = Router();

contactRouter.route("/").get((req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

export default contactRouter;
