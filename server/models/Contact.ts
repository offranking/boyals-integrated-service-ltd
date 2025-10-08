import pool from '../config/database';
import { Contact } from '../types';

export class ContactModel {
  // Create a new contact message
  static async create(contactData: Omit<Contact, 'id' | 'createdAt'>): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO contacts (name, email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [
        contactData.name,
        contactData.email,
        contactData.subject,
        contactData.message
      ]
    );
    
    return (result as any).insertId;
  }

  // Get all contact messages
  static async findAll(): Promise<Contact[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts ORDER BY createdAt DESC'
    );
    return rows as Contact[];
  }

  // Get contact by ID
  static async findById(id: number): Promise<Contact | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts WHERE id = ?',
      [id]
    );
    const contacts = rows as Contact[];
    return contacts.length > 0 ? contacts[0] : null;
  }
}