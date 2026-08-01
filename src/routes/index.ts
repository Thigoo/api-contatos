import { Router } from "express";
import contactRouter from "./contact.route";

const routes = Router();

routes.use("/contacts", contactRouter);

export default routes;
