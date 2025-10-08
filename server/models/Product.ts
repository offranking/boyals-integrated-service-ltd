import pool from '../config/database';
import { Product } from '../types';

export class ProductModel {
  // Create a new product
  static async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, imageUrl, stock, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productData.name,
        productData.description || null,
        productData.price,
        productData.imageUrl || null,
        productData.stock || 0,
        productData.status || 'active'
      ]
    );
    
    return (result as any).insertId;
  }

  // Get all products
  static async findAll(): Promise<Product[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE status = "active" ORDER BY createdAt DESC'
    );
    return rows as Product[];
  }

  // Get product by ID
  static async findById(id: number): Promise<Product | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND status = "active"',
      [id]
    );
    const products = rows as Product[];
    return products.length > 0 ? products[0] : null;
  }

  // Update product
  static async update(id: number, productData: Partial<Product>): Promise<boolean> {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(productData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    
    const [result] = await pool.execute(
      `UPDATE products SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    return (result as any).affectedRows > 0;
  }
}