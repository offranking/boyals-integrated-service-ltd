import pool from '../config/database.js';

export const Testimonial = {
  // Get all testimonials
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        quote,
        author,
        event,
        avatar
      FROM testimonials 
      ORDER BY created_at DESC
    `);
    return rows;
  },

  // Create new testimonial
  async create(testimonialData) {
    const { quote, author, event, avatar } = testimonialData;
    
    const [result] = await pool.execute(`
      INSERT INTO testimonials (quote, author, event, avatar) 
      VALUES (?, ?, ?, ?)
    `, [quote, author, event, avatar]);
    
    return result.insertId;
  }
};
