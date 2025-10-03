import pool from '../config/database.js';

export const Product = {
  // Get all products
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        category,
        brand,
        image,
        description,
        long_description as longDescription,
        specs
      FROM products 
      ORDER BY id
    `);
    return rows.map(row => ({
      ...row,
      specs: JSON.parse(row.specs)
    }));
  },

  // Find product by name
  async findByName(name) {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        category,
        brand,
        image,
        description,
        long_description as longDescription,
        specs
      FROM products 
      WHERE name = ?
    `, [name]);
    
    if (rows.length === 0) return null;
    
    return {
      ...rows[0],
      specs: JSON.parse(rows[0].specs)
    };
  }
};