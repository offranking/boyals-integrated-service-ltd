import pool from '../config/database';
import { Testimonial } from '../types';

export class TestimonialModel {
  // Get all active testimonials
  static async findAll(): Promise<Testimonial[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM testimonials WHERE status = "active" ORDER BY createdAt DESC'
    );
    return rows as Testimonial[];
  }

  // Create a new testimonial
  static async create(testimonialData: Omit<Testimonial, 'id' | 'createdAt'>): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO testimonials (customerName, position, company, content, rating, imageUrl, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        testimonialData.customerName,
        testimonialData.position || null,
        testimonialData.company || null,
        testimonialData.content,
        testimonialData.rating || 5,
        testimonialData.imageUrl || null,
        testimonialData.status || 'active'
      ]
    );
    
    return (result as any).insertId;
  }
}