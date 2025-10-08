// FIX: Changed import to use express as a namespace to resolve type conflicts with global DOM types for Request and Response.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './config/database';
import { BookingModel } from './models/Booking';
import { ContactModel } from './models/Contact';
import { ProductModel } from './models/Product';
import { ServiceModel } from './models/Service';
import { TestimonialModel } from './models/Testimonial';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Specific CORS configuration for development
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only the frontend dev server
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Database connection test on startup
testConnection().then(success => {
  if (success) {
    console.log('✅ Database connection verified on startup');
  } else {
    console.log('❌ Database connection failed on startup');
  }
});

// --- API ENDPOINTS ---

// FIX: Use namespaced types to ensure correct type inference.
app.get('/api/services', async (_req: express.Request, res: express.Response) => {
  try {
    const services = await ServiceModel.findAll();
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// FIX: Use namespaced types to ensure correct type inference.
app.get('/api/products', async (_req: express.Request, res: express.Response) => {
  try {
    const products = await ProductModel.findAll();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// FIX: Use namespaced types to ensure correct type inference.
app.get('/api/testimonials', async (_req: express.Request, res: express.Response) => {
  try {
    const testimonials = await TestimonialModel.findAll();
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
});

// FIX: Use namespaced types to ensure correct type inference.
app.post('/api/booking', async (req: express.Request, res: express.Response) => {
  try {
    console.log('Booking request received:', req.body);
    
    const { customerName, email, phone, serviceType, bookingDate, message } = req.body;

    // Validation
    if (!customerName || !email || !phone || !serviceType || !bookingDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: customerName, email, phone, serviceType, bookingDate' 
      });
    }

    // Create booking in database
    const bookingId = await BookingModel.create({
      customerName,
      email,
      phone,
      serviceType,
      bookingDate: new Date(bookingDate),
      message: message || '',
      status: 'pending'
    });

    // In a real app, you would also send an email notification here
    
    res.status(200).json({ 
      success: true,
      message: 'Booking request received successfully!',
      data: { bookingId }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
});

// FIX: Use namespaced types to ensure correct type inference.
app.post('/api/contact', async (req: express.Request, res: express.Response) => {
  try {
    console.log('Contact message received:', req.body);
    
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, subject, message' 
      });
    }

    // Save contact message to database
    const contactId = await ContactModel.create({
      name,
      email,
      subject,
      message
    });

    // In a real app, you would send an email notification here
    
    res.status(200).json({ 
      success: true,
      message: 'Contact message received successfully!',
      data: { contactId }
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save contact message'
    });
  }
});

// Admin endpoints to get all bookings and contacts
app.get('/api/admin/bookings', async (_req: express.Request, res: express.Response) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

app.get('/api/admin/contacts', async (_req: express.Request, res: express.Response) => {
  try {
    const contacts = await ContactModel.findAll();
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

// Update booking status (admin function)
app.patch('/api/admin/bookings/:id/status', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, or cancelled'
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
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
});

// Health check endpoint
app.get('/api/health', async (_req: express.Request, res: express.Response) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'OK',
    database: dbStatus ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_NAME || 'boyal_service'}`);
});