import pool from '../config/database.js';

export const Service = {
  // Get all services
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        icon_name as iconName,
        title,
        description,
        long_description as longDescription,
        features,
        image,
        highlight_image as highlightImage,
        category
      FROM services 
      ORDER BY id
    `);
    return rows.map(row => ({
      ...row,
      features: JSON.parse(row.features)
    }));
  },

  // Find service by title
  async findByTitle(title) {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        icon_name as iconName,
        title,
        description,
        long_description as longDescription,
        features,
        image,
        highlight_image as highlightImage,
        category
      FROM services 
      WHERE title = ?
    `, [title]);
    
    if (rows.length === 0) return null;
    
    return {
      ...rows[0],
      features: JSON.parse(rows[0].features)
    };
  },

  // Create new service
  async create(serviceData) {
    const { iconName, title, description, longDescription, features, image, highlightImage, category } = serviceData;
    
    const [result] = await pool.execute(`
      INSERT INTO services 
      (icon_name, title, description, long_description, features, image, highlight_image, category) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [iconName, title, description, longDescription, JSON.stringify(features), image, highlightImage, category]);
    
    return result.insertId;
  }
};