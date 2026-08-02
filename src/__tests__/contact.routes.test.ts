import request from "supertest";
import app from "../app";
import * as contactRepository from "../repositories/contact.repository";

jest.mock("../repositories/contact.repository");

describe("GET /contacts", () => {
  it("should return 200 and a list of contacts", async () => {
    const mockContacts = [{ id: 1, name: "John Doe", phone: "123456789" }];
    (contactRepository.findAllContacts as jest.Mock).mockResolvedValue(
      mockContacts,
    );

    const response = await request(app).get("/contacts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContacts);
  });

  it("should return 500 if an error occurs", async () => {
    (contactRepository.findAllContacts as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app).get("/contacts");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });

  it("should return an empty array if there are no contacts", async () => {
    (contactRepository.findAllContacts as jest.Mock).mockResolvedValue([]);
    const response = await request(app).get("/contacts");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /contacts", () => {
  it("should return 201 and the created contact", async () => {
    const mockContact = { id: 1, name: "John Doe", phone: "123456789" };
    (contactRepository.addContact as jest.Mock).mockResolvedValue(mockContact);

    const response = await request(app)
      .post("/contacts")
      .send({ name: "John Doe", phone: "123456789" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockContact);
  });

  it("should return 400 if name and phone are missing", async () => {
    const response = await request(app).post("/contacts").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Name and phone are required" });
  });

  it("should return 400 if name is invalid", async () => {
    const response = await request(app)
      .post("/contacts")
      .send({ name: "John", phone: "123456789" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Name must have at least 2 words with 3+ characters each",
    });
  });

  it("should return 500 if an error occurs", async () => {
    (contactRepository.addContact as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app)
      .post("/contacts")
      .send({ name: "John Doe", phone: "123456789" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});

describe("DELETE /contacts/:id", () => {
  it("should return 204 if the contact is deleted", async () => {
    (contactRepository.removeContact as jest.Mock).mockResolvedValue(true);

    const response = await request(app).delete("/contacts/1");

    expect(response.status).toBe(204);
  });

  it("should return 404 if the contact is not found", async () => {
    (contactRepository.removeContact as jest.Mock).mockResolvedValue(false);

    const response = await request(app).delete("/contacts/1");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Contact not found" });
  });

  it("should return 500 if an error occurs", async () => {
    (contactRepository.removeContact as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app).delete("/contacts/1");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });

  it("should return 400 if the id is invalid", async () => {
    const response = await request(app).delete("/contacts/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid id" });
  });

  it("should return 404 if the contact is not found", async () => {
    (contactRepository.removeContact as jest.Mock).mockResolvedValue(false);

    const response = await request(app).delete("/contacts/1");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Contact not found" });
  });
});

describe("PATCH /contacts/:id", () => {
  it("should return 200 and the updated contact", async () => {
    const mockContact = { id: 1, name: "John Doe", phone: "123456789" };
    (contactRepository.updateContact as jest.Mock).mockResolvedValue(
      mockContact,
    );

    const response = await request(app)
      .patch("/contacts/1")
      .send({ name: "Doe John", phone: "987654321" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContact);
  });

  it("should return 400 if name and phone are missing", async () => {
    const response = await request(app).patch("/contacts/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Name and phone are required" });
  });

  it("should return 400 if name is invalid", async () => {
    const response = await request(app)
      .patch("/contacts/1")
      .send({ name: "John", phone: "123456789" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Name must have at least 2 words with 3+ characters each",
    });
  });

  it("should return 404 if the contact is not found", async () => {
    (contactRepository.updateContact as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .patch("/contacts/1")
      .send({ name: "John Doe", phone: "123456789" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Contact not found" });
  });

  it("should return 500 if an error occurs", async () => {
    (contactRepository.updateContact as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app)
      .patch("/contacts/1")
      .send({ name: "John Doe", phone: "123456789" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });

  it("should return 400 if the id is invalid", async () => {
    const response = await request(app)
      .patch("/contacts/invalid-id")
      .send({ name: "John Doe", phone: "123456789" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid id" });
  });
});
