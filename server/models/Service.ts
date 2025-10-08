import pool from '../config/database';
import { Service } from '../types';

export class ServiceModel {
  // Get all active services
  static async findAll(): Promise<Service[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM services WHERE status = "active" ORDER BY createdAt DESC'
    );
    return rows as Service[];
  }

  // Get service by ID
  static async findById(id: number): Promise<Service | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM services WHERE id = ? AND status = "active"',
      [id]
    );
    const services = rows as Service[];
    return services.length > 0 ? services[0] : null;
  }

  // Create a new service
  static async create(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO services (title, description, price, duration, category, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        serviceData.title,
        serviceData.description || null,
        serviceData.price,
        serviceData.duration || null,
        serviceData.category || null,
        serviceData.status || 'active'
      ]
    );
    
    return (result as any).insertId;
  }
}