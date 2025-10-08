import { Request, Response } from 'express';
import { BookingModel } from '../models/Booking';

export const bookingController = {
  // Create a new booking
  async createBooking(req: Request, res: Response) {
    try {
      const { customerName, email, phone, serviceType, bookingDate, message } = req.body;

      if (!customerName || !email || !phone || !serviceType || !bookingDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const bookingId = await BookingModel.create({
        customerName,
        email,
        phone,
        serviceType,
        bookingDate: new Date(bookingDate),
        message,
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: { id: bookingId }
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get all bookings
  async getBookings(req: Request, res: Response) {
    try {
      const bookings = await BookingModel.findAll();
      
      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update booking status
  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const updated = await BookingModel.updateStatus(parseInt(id), status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        message: 'Booking status updated successfully'
      });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};