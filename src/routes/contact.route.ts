import { Router } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  patchContact,
} from "../controllers/contact.controller";

const contactRouter = Router();

contactRouter.route("/").get(getAllContacts).post(createContact);

contactRouter.route("/:id").patch(patchContact).delete(deleteContact);

export default contactRouter;
