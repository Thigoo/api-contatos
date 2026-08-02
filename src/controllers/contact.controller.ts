import { Request, Response } from "express";
import {
  addContact,
  findAllContacts,
} from "../repositories/contact.repository";
import { ContactDTO } from "../models/contact.model";

interface MySqlError extends Error {
  code?: string;
}

const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await findAllContacts();

    res.status(200).json(contacts);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createContact = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    const contactData: ContactDTO = {
      name,
      phone,
    };

    const contact = await addContact(contactData);

    res.status(201).json(contact);
  } catch (error) {
    const mySqlError = error as MySqlError;

    if (mySqlError.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Contact already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllContacts, createContact };
