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

export const updateContact = async (
  id: number,
  contact: Partial<ContactDTO>,
): Promise<Contact | null> => {
  const fields: string[] = [];
  const values: string[] = [];

  if (contact.name) {
    fields.push("name = ?");
    values.push(contact.name);
  }

  if (contact.phone) {
    fields.push("phone = ?");
    values.push(contact.phone);
  }

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE contacts SET ${fields.join(", ")} WHERE id = ?`,
    [...values, id],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query<(Contact & RowDataPacket)[]>(
    "SELECT * FROM contacts WHERE id = ?",
    [id],
  );

  return rows[0] ?? null;
};
export const removeContact = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM contacts WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
};
