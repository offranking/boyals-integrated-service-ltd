import pool from '../config/database.js';

export const Booking = {
  // Create new booking
  async create(bookingData) {
    const { fullName, email, phone, eventType, subject, service, eventDate, details } = bookingData;
    
    const [result] = await pool.execute(`
      INSERT INTO bookings 
      (full_name, email, phone, event_type, subject, service, event_date, details) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [fullName, email, phone, eventType, subject, service, eventDate, details]);
    
    return result.insertId;
  },

  // Get all bookings
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT * FROM bookings 
      ORDER BY created_at DESC
    `);
    return rows;
  }
};