import { Request, Response } from "express";
import {
  addContact,
  findAllContacts,
  removeContact,
  updateContact,
} from "../repositories/contact.repository";
import { ContactDTO } from "../models/contact.model";
import { validateName } from "../utils/validateName";

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

    const validName = validateName(name);
    if (!validName) {
      return res
        .status(400)
        .json({
          error: "Name must have at least 2 words with 3+ characters each",
        });
    }

    const contactData: ContactDTO = {
      name,
      phone,
    };

    const contact = await addContact(contactData);

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const patchContact = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, phone } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    if (!name && !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    const validName = validateName(name);
    if (!validName) {
      return res.status(400).json({
        error: "Name must have at least 2 words with 3+ characters each",
      });
    }

    const contactData: ContactDTO = {
      name,
      phone,
    };

    const contact = await updateContact(Number(id), contactData);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteContact = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await removeContact(id);

    if (!deleted) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllContacts, createContact, patchContact, deleteContact };
