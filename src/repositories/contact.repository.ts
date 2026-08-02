import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Contact, ContactDTO } from "../models/contact.model";

export const findAllContacts = async () => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM contacts");
  return rows;
};

export const addContact = async (contact: ContactDTO): Promise<Contact> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO contacts (name, phone) VALUES (?, ?)",
    [contact.name, contact.phone],
  );
  return {
    id: result.insertId,
    ...contact,
  };
};
