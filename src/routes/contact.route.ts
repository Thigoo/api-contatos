import { Router } from "express";
import {
  createContact,
  getAllContacts,
} from "../controllers/contact.controller";

const contactRouter = Router();

contactRouter.route("/").get(getAllContacts).post(createContact);

export default contactRouter;
