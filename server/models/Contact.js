import pool from '../config/database.js';

export const Contact = {
  // Create new contact message
  async create(contactData) {
    const { name, email, message } = contactData;
    
    const [result] = await pool.execute(`
      INSERT INTO contact_messages (name, email, message) 
      VALUES (?, ?, ?)
    `, [name, email, message]);
    
    return result.insertId;
  },

  // Get all contact messages
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `);
    return rows;
  }
};