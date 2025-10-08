import pool from '../config/database';
import { Booking } from '../types';

export class BookingModel {
  // Create a new booking
  static async create(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO bookings (customerName, email, phone, serviceType, bookingDate, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.customerName,
        bookingData.email,
        bookingData.phone,
        bookingData.serviceType,
        bookingData.bookingDate,
        bookingData.message || null,
        bookingData.status || 'pending'
      ]
    );
    
    return (result as any).insertId;
  }

  // Get all bookings
  static async findAll(): Promise<Booking[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM bookings ORDER BY createdAt DESC'
    );
    return rows as Booking[];
  }

  // Get booking by ID
  static async findById(id: number): Promise<Booking | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    const bookings = rows as Booking[];
    return bookings.length > 0 ? bookings[0] : null;
  }

  // Update booking status
  static async updateStatus(id: number, status: Booking['status']): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE bookings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    return (result as any).affectedRows > 0;
  }

  // Delete booking
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM bookings WHERE id = ?',
      [id]
    );
    return (result as any).affectedRows > 0;
  }
}